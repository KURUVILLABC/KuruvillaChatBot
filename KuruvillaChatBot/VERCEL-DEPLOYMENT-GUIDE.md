# Vercel Deployment Checklist

## ✅ Pre-Deployment Verification

- ✅ Code committed to GitHub (branch: `main`)
- ✅ Latest commit: `dc5d83f`
- ✅ Production build created (`npm run build`)
- ✅ Build succeeded (47KB gzipped)
- ✅ `chat-website/` folder contains `dist/` directory
- ✅ `vercel.json` configuration file present
- ✅ Repository: `KURUVILLABC/KuruvillaChatBot`

---

## 🚀 Deployment Checklist

### Phase 1: GitHub Authentication
```
[ ] 1. Go to https://vercel.com/new
[ ] 2. Click "Continue with GitHub"
[ ] 3. Sign in with GitHub credentials
[ ] 4. Click "Authorize vercel"
```

### Phase 2: Repository Selection
```
[ ] 5. Find and select: KuruvillaChatBot
```

### Phase 3: Project Configuration
```
[ ] 6. Set Root Directory: chat-website
[ ] 7. Framework: Vite (auto-selected)
[ ] 8. Build Command: npm run build
[ ] 9. Output Directory: dist
```

### Phase 4: Environment Variables
```
[ ] 10. Click "Environment Variables" or "Add"
[ ] 11. Key: VITE_BACKEND_URL
[ ] 12. Value: http://localhost:3000
[ ] 13. (Optional) Add more env vars if needed
```

### Phase 5: Deploy
```
[ ] 14. Click "Deploy" button
[ ] 15. Wait for build to complete (2-3 minutes)
[ ] 16. Confirm "Ready" status
[ ] 17. Copy your live URL
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
- **URL**: `https://kuruvilla-chat-[random].vercel.app`
- **Status**: 🟢 Live and Ready
- **Performance**: Deployed on Vercel CDN (59 global locations)

### Test It
1. Open the live URL
2. Try asking: "What are your technical skills?"
3. Verify the response (may need backend running)

---

## 🔧 Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_BACKEND_URL` | `http://localhost:3000` | Local backend (dev) |
| `VITE_BACKEND_URL` | `https://api.example.com` | Deployed backend (prod) |

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

1. **Complete deployment** (follow checklist above)
2. **Get live URL** from Vercel dashboard
3. **Test chat** at your live URL
4. **Share URL** with others
5. (Optional) **Deploy backend** for production use

---

**Good luck! 🎉 Your chat website will be live in minutes!**
