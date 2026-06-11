# Broadway Model Town — Launch Tracker

## Deploy to Render

1. Push this folder to a **GitHub repository** (public or private)
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml` and configure everything
5. Click **Deploy**

### Manual settings if needed:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run serve`
- **Environment:** Node
- **Port:** 10000

### Firebase Authorized Domains
Add your Render URL to Firebase Console:
Authentication → Settings → Authorized Domains → Add domain
e.g. `broadway-model-town-tracker.onrender.com`
