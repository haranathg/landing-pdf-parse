# AWS Deployment Guide: App Runner + Amplify

## Overview

| Component | AWS Service | Deploy Method |
|-----------|-------------|---------------|
| Backend (FastAPI) | App Runner | Git-based |
| Frontend (React) | Amplify | Git-based |

---

## Step 1: Deploy Backend to App Runner

### 1.1 Add config to your backend repo

Copy `apprunner.yaml` to your backend folder root:
```
backend/
├── apprunner.yaml   <-- add this
├── main.py
├── requirements.txt
└── routers/
```

### 1.2 Update CORS in main.py

Add your future Amplify domain (you can update this after deploy):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://*.amplifyapp.com",  # Amplify domains
        # Add your custom domain later if needed
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 1.3 Create App Runner Service

1. Go to **[AWS App Runner Console](https://console.aws.amazon.com/apprunner)**
2. Click **Create service**
3. **Source and deployment:**
   - Repository type: **Source code repository**
   - Click **Add new** → Connect your GitHub account
   - Select your backend repo
   - Branch: `main` (or your default branch)
4. **Build settings:**
   - Configuration file: **Use configuration file** ✓
   - (It will auto-detect `apprunner.yaml`)
5. **Service settings:**
   - Service name: `landing-pdf-backend`
   - CPU: 1 vCPU (can start small)
   - Memory: 2 GB
6. **Environment variables** (click "Add environment variable"):
   ```
   ANTHROPIC_API_KEY     = sk-ant-xxxxx
   VISION_AGENT_API_KEY  = your-landing-ai-key
   ```
7. Click **Create & deploy**
8. Wait ~5 min → Copy your URL: `https://xxxxx.us-east-1.awsapprunner.com`

### 1.4 Test Backend

```bash
curl https://xxxxx.us-east-1.awsapprunner.com/health
# Should return: {"status":"healthy"}
```

---

## Step 2: Deploy Frontend to Amplify

### 2.1 Add config to your frontend repo

Copy `amplify.yml` to your frontend folder root:
```
frontend/
├── amplify.yml   <-- add this
├── package.json
├── src/
└── vite.config.ts
```

### 2.2 Create Amplify App

1. Go to **[AWS Amplify Console](https://console.aws.amazon.com/amplify)**
2. Click **Create new app**
3. **Source:** Select **GitHub**
4. Authorize AWS Amplify to access your GitHub
5. Select your frontend repo and branch
6. **Build settings:**
   - Amplify will auto-detect `amplify.yml`
   - Framework: should auto-detect Vite
7. **Environment variables** (expand "Advanced settings"):
   ```
   VITE_API_URL = https://xxxxx.us-east-1.awsapprunner.com
   ```
   (Use the App Runner URL from Step 1)
8. Click **Save and deploy**
9. Wait ~3 min → Your app is live at: `https://main.xxxxxxx.amplifyapp.com`

---

## Step 3: Update CORS (Final Step)

Once you have your Amplify URL, update your backend's CORS:

```python
allow_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://main.xxxxxxx.amplifyapp.com",  # Your actual Amplify URL
],
```

Push the change → App Runner auto-deploys.

---

## Quick Reference

### Env Variables Summary

**App Runner (Backend):**
| Variable | Value |
|----------|-------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `VISION_AGENT_API_KEY` | Your Landing.AI key |

**Amplify (Frontend):**
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your App Runner URL |

### Auto-Deploy

Both services auto-deploy when you push to your connected branch. No manual redeploy needed!

### Estimated Costs

| Service | Cost |
|---------|------|
| App Runner | ~$5-15/mo (pauses when idle) |
| Amplify Hosting | Free tier covers most dev usage |

---

## Troubleshooting

### Backend not starting?
- Check App Runner logs in the console
- Verify `requirements.txt` has all dependencies
- Make sure `main:app` matches your FastAPI app location

### Frontend can't reach backend?
- Check CORS settings include your Amplify domain
- Verify `VITE_API_URL` doesn't have a trailing slash
- Check browser console for errors

### Build failing?
- App Runner: Check build logs for Python errors
- Amplify: Check build logs for npm/node errors

---

## Optional: Custom Domain

Both services support custom domains:

**App Runner:**
Settings → Custom domains → Add domain

**Amplify:**
App settings → Domain management → Add domain

Both provide free SSL certificates.
