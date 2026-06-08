# 🚀 Complete Render.com Deployment Checklist & Verification Guide

## Pre-Deployment (1-2 hours)

### Repository Setup
- [ ] All secrets removed from code and .env files
- [ ] `.gitignore` includes `.env`, `.env.local`, `.env.*.local`
- [ ] No credentials in commit history (check git log)
- [ ] `.env.example` files created with documentation
- [ ] `render.yaml` file in root directory
- [ ] `DEPLOYMENT_AUDIT.md` reviewed and understood
- [ ] All code fixes from audit applied
- [ ] Code committed and pushed to GitHub

### External Services Setup
- [ ] MongoDB Atlas account created
- [ ] Database cluster created and running
- [ ] Database user created with strong password
- [ ] Connection string copied and ready
- [ ] IP whitelist: "Allow access from anywhere" (temporary)
- [ ] Groq API account created
- [ ] API key generated from console.groq.com
- [ ] Render.com account created and linked to GitHub

### Environment Variables Documented
- [ ] `PORT` - (Render assigns automatically)
- [ ] `NODE_ENV` - "production"
- [ ] `MONGODB_URI` - Full connection string
- [ ] `JWT_SECRET` - Generated strong secret
- [ ] `AI_API_KEY` - Groq API key
- [ ] `FRONTEND_URL` - Frontend service URL (will update after frontend deployed)
- [ ] All variables documented in `.env.example`

---

## Phase 1: Backend Deployment (15-20 minutes)

### Step 1.1: Create Backend Service on Render
- [ ] Go to [render.com](https://render.com) Dashboard
- [ ] Click "New+" → Web Service
- [ ] Select GitHub repository
- [ ] Configure:
  ```
  Name: finsight-api
  Environment: Node
  Region: Ohio (or closest to your users)
  Branch: main
  Build Command: cd backend && npm install
  Start Command: node backend/app.js
  ```
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (3-5 minutes)

### Step 1.2: Add Environment Variables
- [ ] Click "Environment" section
- [ ] Add each variable:
  - `NODE_ENV` = `production`
  - `MONGODB_URI` = `mongodb+srv://...`
  - `JWT_SECRET` = Generated secret
  - `AI_API_KEY` = Groq API key
  - `FRONTEND_URL` = Leave blank for now (update after frontend deployed)
- [ ] Click "Save"
- [ ] Service automatically redeploys with new variables

### Step 1.3: Test Backend
- [ ] Go to service dashboard
- [ ] Find your service URL: `https://finsight-api-xxxx.onrender.com`
- [ ] Test health endpoint in browser:
  ```
  https://finsight-api-xxxx.onrender.com/health
  ```
- [ ] Expected response (200 OK):
  ```json
  {
    "status": "healthy",
    "timestamp": "...",
    "uptime": 123.45,
    "environment": "production"
  }
  ```
- [ ] Check backend logs for errors:
  ```
  ✅ MongoDB connected successfully
  🚀 Server configured to listen on port: (some number)
  ```

### Step 1.4: Troubleshoot Backend Issues

**If health check fails (status: unhealthy):**
- [ ] Check MongoDB connection in logs
- [ ] Verify `MONGODB_URI` is correct
- [ ] Check MongoDB Atlas is running
- [ ] Verify IP whitelist includes Render.com
- [ ] Check database user password

**If service won't start:**
- [ ] Click "Logs" and scroll to bottom
- [ ] Look for error messages
- [ ] Common issues:
  - Missing environment variables
  - Wrong build command
  - Syntax errors in code
  - Dependencies not installed

**If "Cannot GET /" error:**
- [ ] This is expected! Backend is API-only
- [ ] Use `/health` endpoint instead
- [ ] Frontend will be separate service

---

## Phase 2: Frontend Deployment (15-20 minutes)

### Step 2.1: Update Frontend Configuration
- [ ] Update `frontend/.env` with backend URL:
  ```
  VITE_API_URL=https://finsight-api-xxxx.onrender.com/api
  ```
  (Replace xxxx with your actual service name)
- [ ] Commit and push:
  ```bash
  git add frontend/.env
  git commit -m "chore: update backend URL for production"
  git push origin main
  ```

### Step 2.2: Create Frontend Static Site on Render
- [ ] Go to Render Dashboard
- [ ] Click "New+" → Static Site
- [ ] Select GitHub repository
- [ ] Configure:
  ```
  Name: finsight-frontend
  Branch: main
  Build Command: cd frontend && npm install && npm run build
  Publish Directory: frontend/dist
  ```
- [ ] Click "Create Static Site"
- [ ] Wait for build and deployment (2-3 minutes)

### Step 2.3: Test Frontend
- [ ] Go to Static Site dashboard
- [ ] Find your site URL: `https://finsight-frontend-xxxx.onrender.com`
- [ ] Visit the URL in browser
- [ ] Verify:
  - [ ] Login page loads
  - [ ] No blank white screen
  - [ ] No console errors (F12 → Console)
  - [ ] All images load correctly

### Step 2.4: Update Backend CORS
- [ ] Go to Backend Web Service
- [ ] Click "Environment"
- [ ] Update `FRONTEND_URL`:
  ```
  https://finsight-frontend-xxxx.onrender.com
  ```
- [ ] Save and wait for auto-redeploy (1-2 minutes)

---

## Phase 3: End-to-End Testing (20-30 minutes)

### Step 3.1: User Registration Flow
- [ ] Open frontend in browser
- [ ] Click "Register"
- [ ] Fill in username and password (strong password!)
- [ ] Click "Sign Up"
- [ ] Expected: Success message, redirected to login
- [ ] Verify no errors in browser console (F12)

### Step 3.2: User Login Flow
- [ ] Enter registered username
- [ ] Enter password
- [ ] Click "Sign In"
- [ ] Expected: Loading screen → Dashboard
- [ ] Verify:
  - [ ] No CORS errors in console
  - [ ] Dashboard loads without errors
  - [ ] Simulations list shows (empty initially)

### Step 3.3: Create Simulation
- [ ] Click "New Simulation"
- [ ] Fill out all form fields:
  - [ ] Simulation Name (min 3 chars)
  - [ ] Segment (min 3 chars)
  - [ ] Key Features (min 10 chars)
  - [ ] Market Conditions (min 10 chars)
  - [ ] Compliance Notes (min 5 chars)
- [ ] Click "Submit"
- [ ] Expected:
  - [ ] Loading message appears
  - [ ] AI processes (10-20 seconds)
  - [ ] Success alert appears
  - [ ] Modal closes
  - [ ] Simulation appears in dashboard
- [ ] Verify no errors in browser console

### Step 3.4: View Simulation Details
- [ ] Click on created simulation
- [ ] Expected:
  - [ ] Simulation details page loads
  - [ ] Market Fit Score shows (1-10)
  - [ ] Risk Level shows (low/medium/high)
  - [ ] Compliance Status shows (passed/pending/failed)
  - [ ] All fields populated

### Step 3.5: Rerun Simulation
- [ ] Click "Re-run Simulation"
- [ ] Modal opens with current values
- [ ] Modify one field (e.g., target segment)
- [ ] Click "Re-run Simulation"
- [ ] Expected:
  - [ ] Loading spinner appears
  - [ ] AI processes (10-20 seconds)
  - [ ] Success message appears
  - [ ] Page refreshes with new results
  - [ ] Previous data is updated

### Step 3.6: Delete Simulation
- [ ] Go back to dashboard (button on details page)
- [ ] Click on a simulation
- [ ] Click "Delete Simulation"
- [ ] Confirm deletion
- [ ] Expected:
  - [ ] Modal appears asking confirmation
  - [ ] After confirmation, redirects to dashboard
  - [ ] Simulation no longer in list

### Step 3.7: Logout & Login Again
- [ ] Click "Logout"
- [ ] Expected: Redirected to login page
- [ ] Login with same credentials
- [ ] Expected: Simulations still exist (data persisted)

---

## Phase 4: Browser & Console Verification

### Check For Errors (F12 → Console)

**Expected: CLEAN console with NO errors**

**Common errors to fix:**
```
❌ CORS error: "Access to XMLHttpRequest blocked by CORS policy"
   → Update FRONTEND_URL in backend environment

❌ 404 errors for "/FinSightAI-Logo2.png"
   → Check favicon path in index.html

❌ "Cannot read property of undefined"
   → Check error boundary caught it - should show error page

❌ "token is undefined"
   → Check localStorage in DevTools → Application
```

### Network Tab Verification

1. Open DevTools (F12)
2. Click "Network" tab
3. Refresh page
4. Verify requests:
   - [ ] All fetch/XHR requests have status 200-299
   - [ ] No 401/403/500 errors
   - [ ] API base URL is correct (not localhost)
   - [ ] Login request returns token

### Application Tab Verification

1. DevTools → Application tab
2. Click "Local Storage"
3. Verify:
   - [ ] `token` is stored after login
   - [ ] Token looks like: `eyJhb...` (JWT format)
   - [ ] Token deleted on logout

---

## Phase 5: Production Monitoring Setup

### Enable Error Tracking
- [ ] (Optional) Set up Sentry for error monitoring
- [ ] (Optional) Configure uptime monitoring
- [ ] (Optional) Set up log aggregation

### Configure Alerts
- [ ] Backend service logs checked daily
- [ ] Monitor health endpoint status
- [ ] Set up Slack/email notifications for failures

### Database Security
- [ ] MongoDB Atlas: Restrict IP whitelist to Render.com IPs only
- [ ] Enable authentication required
- [ ] Regular backups enabled

---

## Final Verification Checklist

### Security ✅
- [ ] No hardcoded secrets in code
- [ ] Environment variables used correctly
- [ ] HTTPS enforced (Render default)
- [ ] CORS restricted to production URL only
- [ ] Security headers present

### Performance ✅
- [ ] Homepage loads in < 3 seconds
- [ ] Simulation creation in < 30 seconds (AI processing)
- [ ] Database queries use indexes
- [ ] No memory leaks detected

### Reliability ✅
- [ ] Health endpoint returns 200 OK
- [ ] Can create/read/update/delete simulations
- [ ] No unhandled errors in logs
- [ ] Service auto-restarts on failure

### User Experience ✅
- [ ] Error messages are clear and helpful
- [ ] Loading states show during long operations
- [ ] Forms prevent duplicate submissions
- [ ] Session persists across browser refresh
- [ ] Logout works correctly

### Documentation ✅
- [ ] DEPLOYMENT_AUDIT.md reviewed
- [ ] RENDER_DEPLOYMENT_GUIDE.md followed
- [ ] Environment variables documented
- [ ] Team knows how to debug issues

---

## Common Issues & Solutions

### Issue: "Application failed to boot"
```
Solution:
1. Check logs for specific error
2. Verify all environment variables set
3. Verify MongoDB connection
4. Check start command is correct
```

### Issue: Frontend shows "localhost" in URLs
```
Solution:
1. Check frontend .env has correct VITE_API_URL
2. Rebuild frontend: npm run build
3. Commit and push to trigger redeploy
```

### Issue: Login works but simulations won't load
```
Solution:
1. Check CORS error in browser console
2. Verify FRONTEND_URL in backend environment
3. Restart backend service
4. Check MongoDB connection is working
```

### Issue: Simulations fail to create
```
Solution:
1. Check Groq API key is valid
2. Verify AI_API_KEY in environment
3. Check backend logs for specific error
4. Try again (might be Groq API timeout)
```

### Issue: "Database failed to save"
```
Solution:
1. Check MONGODB_URI connection string
2. Verify MongoDB cluster is running
3. Check database user credentials
4. Check IP whitelist includes Render.com
```

---

## Celebration! 🎉

If all checks pass:

✅ **Your application is live and ready for production!**

**Next steps:**
1. Share the frontend URL with your team
2. Create test accounts
3. Monitor logs daily
4. Plan for scaling if needed
5. Consider implementing monitoring and alerting

---

## Support Contacts

- **Render Support**: https://render.com/support
- **MongoDB Support**: https://www.mongodb.com/support
- **Groq API Support**: https://console.groq.com/support
- **Your Team**: Share this guide with your developers!

---

**Last Updated:** 2026-06-08  
**Status:** Ready for Deployment  
**Estimated Time:** 1-2 hours total

