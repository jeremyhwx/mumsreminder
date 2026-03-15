const express = require('express');
const webpush = require('web-push');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// VAPID keys for push notifications
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:admin@mumsreminders.com';

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Simple JSON file storage (no database needed)
const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { reminders: [], subscriptions: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { reminders: [], subscriptions: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- API Routes ---

// Get all reminders
app.get('/api/reminders', (req, res) => {
  const data = loadData();
  res.json(data.reminders);
});

// Add a reminder
app.post('/api/reminders', (req, res) => {
  const data = loadData();
  const reminder = { ...req.body, id: Date.now().toString() };
  data.reminders.push(reminder);
  saveData(data);
  res.json(reminder);
});

// Delete a reminder
app.delete('/api/reminders/:id', (req, res) => {
  const data = loadData();
  data.reminders = data.reminders.filter(r => r.id !== req.params.id);
  saveData(data);
  res.json({ ok: true });
});

// Save push subscription from her phone
app.post('/api/subscribe', (req, res) => {
  const data = loadData();
  const sub = req.body;
  // Avoid duplicates
  const exists = data.subscriptions.find(s => s.endpoint === sub.endpoint);
  if (!exists) {
    data.subscriptions.push(sub);
    saveData(data);
  }
  res.json({ ok: true });
});

// Expose public VAPID key to frontend
app.get('/api/vapid-public-key', (req, res) => {
  res.json({ key: VAPID_PUBLIC_KEY });
});

// --- Cron job: check every minute ---
cron.schedule('* * * * *', () => {
  const data = loadData();
  if (!data.reminders.length || !data.subscriptions.length) return;

  const now = new Date();
  // Use Singapore time (UTC+8)
  const sgTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
  const currentHour = sgTime.getHours();
  const currentMinute = sgTime.getMinutes();
  const currentDay = sgTime.getDay(); // 0=Sun, 1=Mon...6=Sat

  data.reminders.forEach(reminder => {
    const [rHour, rMin] = reminder.time.split(':').map(Number);
    if (rHour !== currentHour || rMin !== currentMinute) return;

    const shouldFire =
      reminder.frequency === 'daily' ||
      (reminder.frequency === 'weekly' && reminder.days.includes(currentDay));

    if (!shouldFire) return;

    console.log(`Firing reminder: ${reminder.text} at ${reminder.time}`);

    const payload = JSON.stringify({
      title: reminder.icon + ' ' + reminder.text,
      body: 'Tap to open',
      icon: reminder.icon,
      reminderText: reminder.text,
      reminderIcon: reminder.icon,
    });

    data.subscriptions.forEach(sub => {
      webpush.sendNotification(sub, payload).catch(err => {
        console.error('Push failed:', err.statusCode);
        // Remove dead subscriptions
        if (err.statusCode === 410) {
          data.subscriptions = data.subscriptions.filter(s => s.endpoint !== sub.endpoint);
          saveData(data);
        }
      });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Mum's Reminders running on port ${PORT}`));
