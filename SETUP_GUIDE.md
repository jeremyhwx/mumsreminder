# Mum's Reminders — Setup Guide
### No coding knowledge needed. Takes about 20–30 minutes.

---

## Overview of what we're doing
1. Put the app code on GitHub (free code storage)
2. Deploy it to Render (free server that runs 24/7)
3. Install it on Mum's iPhone like an app

---

## PART 1 — Put the code on GitHub

### Step 1 — Create a new repository on GitHub
1. Go to github.com and log in
2. Click the **+** button in the top right corner → **New repository**
3. Name it: `mumsreminders`
4. Make sure it's set to **Public**
5. Leave everything else as default
6. Click **Create repository**

### Step 2 — Upload the files
1. On the repository page, click **uploading an existing file** (it's a link in the middle of the page)
2. Drag ALL the files from the `mumsreminders` folder I gave you into the upload area
   - Make sure to include the `public` folder and everything inside it
   - Do NOT include the `node_modules` folder (it's too big — GitHub will ignore it anyway via .gitignore)
3. Scroll down, click **Commit changes**

Your code is now on GitHub! ✅

---

## PART 2 — Deploy to Render (the free server)

### Step 3 — Create a new Web Service on Render
1. Go to render.com and log in
2. Click **New +** → **Web Service**
3. Click **Connect a repository**
4. If asked, click **Connect GitHub** and authorize Render to access your GitHub
5. Find `mumsreminders` in the list and click **Connect**

### Step 4 — Configure the service
Fill in these settings:

| Field | Value |
|-------|-------|
| Name | mumsreminders |
| Region | Singapore (Southeast Asia) |
| Branch | main |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Instance Type | **Free** |

Click **Create Web Service** and wait 2–3 minutes for it to build.

### Step 5 — Add the VAPID keys (push notification credentials)
This is the bit that makes alarms fire on her phone.

1. Once deployed, click **Environment** in the left sidebar
2. Click **Add Environment Variable** and add these one by one:

| Key | Value |
|-----|-------|
| `VAPID_PUBLIC_KEY` | `BPFtDNY9NuwBabqC9h3VAMHTAUzKl4kuqbeJzo24Uj2NgRiQX4wHOQmB5bfCLveJxADs-xCzYE4XBeJje5HyUsc` |
| `VAPID_PRIVATE_KEY` | `IojLATrXYi4NzNSoyyWiKk0TvdtqmCGRBu-hP285bC4` |
| `VAPID_EMAIL` | `mailto:your@email.com` (use your actual email) |

3. Click **Save Changes** — Render will automatically restart the server

### Step 6 — Get your app URL
After it restarts, you'll see a green URL at the top of the Render page — something like:
`https://mumsreminders.onrender.com`

That's your app! Open it in your browser to confirm it loads. ✅

---

## PART 3 — Install on Mum's iPhone

### Step 7 — Open the app in Safari on her iPhone
1. On her iPhone, open **Safari** (must be Safari, not Chrome)
2. Go to your Render URL (e.g. `https://mumsreminders.onrender.com`)

### Step 8 — Add to Home Screen
1. Tap the **Share button** (the box with the arrow pointing up, at the bottom of Safari)
2. Scroll down and tap **Add to Home Screen**
3. Tap **Add** in the top right

The app now appears on her home screen like a real app! 📱

### Step 9 — Enable notifications
1. Open the app from her home screen (important — must open from home screen, not Safari)
2. Tap the green **"Enable Alarm Notifications"** button
3. When iPhone asks "Allow notifications?" — tap **Allow**

That's it! The alarms will now fire even when her phone is locked. ✅

---

## PART 4 — Set up reminders

### Step 10 — Add her reminders
You can do this from YOUR phone or laptop — just go to the same Render URL and add the reminders. They're stored on the server so they'll fire on her phone.

For each reminder:
- Type what it is (e.g. "Take morning medicine")
- Pick an icon
- Set the time
- Choose Every day or specific days

---

## Important notes

### The free Render plan "sleeps" after 15 minutes of no traffic
This means if nobody visits the app for 15 minutes, the server goes to sleep and takes ~30 seconds to wake up when someone visits. **This does NOT affect alarms** — the cron job that fires notifications keeps the server awake. But if the first load of the page is slow, that's why.

### Reminders use Singapore time
The server is set to fire alarms at the right time in Singapore. If she's travelling abroad, the alarms will still fire at the Singapore time you set.

### If alarms stop working
Check that:
1. The app is still on her home screen
2. Notifications are allowed: Settings → Notifications → Reminders → Allow Notifications = ON
3. The Render service is still running (log in to render.com to check)

---

## Updating reminders later

You can add or delete reminders anytime by going to the app URL from any browser. No need to touch her phone.

---

That's everything! Message me if you get stuck on any step.
