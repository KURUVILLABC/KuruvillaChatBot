# Vercel Deployment Guide

This repository has one canonical frontend deployment:

`https://kuruvilla-chat.vercel.app`

Every push to `main` should deploy this Vercel project and update that domain.
Do not use `kuruvilla-chat-bot.vercel.app` as a second production site.

## ✅ Pre-Deployment Verification

- ✅ Code committed to GitHub (branch: `main`)
- Repository: `KURUVILLABC/KuruvillaChatBot`
- Production branch: `main`
- Canonical domain: `kuruvilla-chat.vercel.app`
- Deployment configuration: `vercel.json` at the repository root

---

## 🚀 Deployment Checklist

### Phase 1: Vercel Project
```
[ ] 1. Open the existing Vercel project assigned to `kuruvilla-chat.vercel.app`
[ ] 2. Settings → Git → connect `KURUVILLABC/KuruvillaChatBot`
[ ] 3. Set the production branch to `main`
[ ] 4. Enable automatic deployments for pushes to `main`
[ ] 5. Remove or detach any competing production project using this repository
```

### Phase 2: Build Configuration
```
[ ] Root Directory: repository root (`.`)
[ ] Framework Preset: Other (the root `vercel.json` controls the build)
[ ] Build Command: `npm run build:chat-website`
[ ] Output Directory: `chat-website/dist`
[ ] Install Command: `npm install && npm install --prefix chat-website`
```

If the Vercel project is configured with `chat-website` as its Root Directory instead,
use `npm run build` and `dist` as the build and output settings, and do not also apply
the root `vercel.json` settings.

### Phase 3: Domain
```
[ ] Keep `kuruvilla-chat.vercel.app` assigned to this project
[ ] Set it as the project production domain
[ ] Remove `kuruvilla-chat-bot.vercel.app` from production aliases if it is not wanted
```

### Phase 4: Environment Variables
```
[ ] Add `VITE_BACKEND_URL` for Production
[ ] Set it to the public Render URL for `kuruvilla-chat-backend`
[ ] Do not use `http://localhost:3000` in Vercel
[ ] Redeploy after changing the variable (Vite embeds it at build time)
```

### Phase 5: Deploy
```
[ ] Trigger a deployment from the latest `main` commit
[ ] Wait for the deployment to show `Ready`
[ ] Open `https://kuruvilla-chat.vercel.app`
[ ] Confirm the status indicator says `Connected`
```

---

## 📊 Expected Build Output

```
✓ dist/index.html                   0.69 kB
✓ dist/assets/index-*.css           1.69 kB (gzipped)
✓ dist/assets/index-*.js           47.45 kB (gzipped)
✓ Built in 1.41s
```

---

## 🌐 After Deployment

### Your Live Chat Website
- **URL**: `https://kuruvilla-chat.vercel.app`
- **Status**: Must be `Ready` in Vercel and `Connected` in the UI

### Test It
1. Open the live URL
2. Try asking: "What are your technical skills?"
3. Verify the response (may need backend running)

---

## 🔧 Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_BACKEND_URL` | `http://localhost:3000` | Local development only |
| `VITE_BACKEND_URL` | Render public service URL | Vercel Production and Preview environments |

---

## 🚨 Troubleshooting

### Issue: Build Failed
**Solution**: Verify `chat-website/` has these files:
- ✓ `src/App.tsx`
- ✓ `src/main.tsx`
- ✓ `src/index.css`
- ✓ `index.html`
- ✓ `package.json`
- ✓ `vite.config.ts`

### Issue: Connection Status Shows "Disconnected"
**Solution**: 
- Backend must be running at `VITE_BACKEND_URL`
- Or update env var with your deployed backend URL

### Issue: Messages Not Sending
**Solution**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Verify backend is accessible
4. Check CORS settings on backend

---

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vite Guide**: https://vitejs.dev/
- **React Guide**: https://react.dev/

---

## ✨ Next Steps

1. Confirm the Vercel Git project and canonical domain settings
2. Deploy the backend to Render and copy its public URL
3. Set `VITE_BACKEND_URL` in Vercel and redeploy
4. Run the QA checks below against the canonical domain

## Verification and QA

Run the frontend build from the repository root:

```powershell
npm run build:chat-website
```

Verify the deployed frontend and backend:

```powershell
Invoke-WebRequest https://kuruvilla-chat.vercel.app -UseBasicParsing
Invoke-WebRequest https://<render-backend-host>/api/health -UseBasicParsing
```

In the browser, confirm the site loads, the status says `Connected`, and a question
such as `What projects have been built?` receives a response. A frontend deployment
cannot pass the connection check until `VITE_BACKEND_URL` points to a reachable
public backend with CORS configured for `https://kuruvilla-chat.vercel.app`.

---

**Good luck! 🎉 Your chat website will be live in minutes!**
