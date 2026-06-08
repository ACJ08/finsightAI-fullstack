# FinSight AI - Complete Render.com Deployment Guide

## 🚀 Pre-Deployment Checklist

Before deploying to Render.com, ensure you have completed ALL items in the DEPLOYMENT_AUDIT.md file, specifically:

- [ ] All secrets removed from version control
- [ ] .env.example files created
- [ ] Code fixes applied
- [ ] Environment variables documented
- [ ] CORS configured for production URL
- [ ] Database indexes created
- [ ] MongoDB Atlas IP whitelist configured for Render.com

---

## 📋 Step-by-Step Deployment to Render.com

### Phase 1: Prepare MongoDB Atlas (5-10 minutes)

**1.1 Create/Configure MongoDB Atlas Database**

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign in or create free account
3. Create a new cluster (M0 free tier is fine for testing)
4. Go to **Database Access** → Create database user
   - Username: `finsight_user` (or your choice)
   - Password: Generate strong password, save it!
   - Built-in Role: `readWriteAnyDatabase`

5. Go to **Network Access** → Add IP Address
   - Click "Add Current IP Address" for local development
   - Then add Render.com IP: Click "Allow access from anywhere" (temporary)
   - Later, whitelist only Render IPs for better security

6. Get your connection string:
   - Cluster → Connect → Drivers → Node.js
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

**1.2 Create Render.com Account**

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Connect your GitHub repository

---

### Phase 2: Deploy Backend (10-15 minutes)

**2.1 Create Backend Web Service**

1. In Render Dashboard → Create New → Web Service
2. Select your `finsightAI-fullstack` repository
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `finsight-api` |
| **Environment** | `Node` |
| **Region** | Select closest to your users |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `node backend/app.js` |

4. Click **Create Web Service** and wait for build to complete

**2.2 Add Environment Variables**

In Render Dashboard → Web Service → Environment:

```
# Required variables
MONGODB_URI=mongodb+srv://finsight_user:YOUR_PASSWORD@cluster.mongodb.net/finsight?retryWrites=true&w=majority

JWT_SECRET=<generate with: openssl rand -base64 32>

AI_API_KEY=<your Groq API key from console.groq.com>

FRONTEND_URL=https://<your-frontend-service-name>.onrender.com

NODE_ENV=production

# Optional
LOG_LEVEL=info
```

3. Click **Save Changes**
4. The service will automatically redeploy with new variables

**2.3 Test Backend Deployment**

Your backend is now running at: `https://finsight-api-xxxx.onrender.com/`

Test it with:
```bash
curl https://finsight-api-xxxx.onrender.com/health

# Expected response:
# {"status":"healthy","timestamp":"2026-06-08T...","uptime":123.456,"environment":"production"}
```

---

### Phase 3: Deploy Frontend (10-15 minutes)

**3.1 Build and Deploy Frontend**

1. Update `frontend/.env` with your backend URL:
```
VITE_API_URL=https://finsight-api-xxxx.onrender.com/api
```

2. Commit the .env change:
```bash
git add frontend/.env
git commit -m "chore: update frontend API URL for production"
git push origin main
```

3. In Render Dashboard → Create New → Static Site
4. Select your repository
5. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `finsight-frontend` |
| **Repository** | Your repository |
| **Branch** | `main` |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Publish Directory** | `frontend/dist` |

6. Click **Create Static Site**

**3.2 Test Frontend Deployment**

Your frontend is now running at: `https://finsight-frontend-xxxx.onrender.com/`

Check:
1. Login page loads correctly
2. Can log in with test account
3. Can see dashboard
4. Simulations list loads
5. Can create a new simulation

---

## 🔧 Post-Deployment Configuration

### Update Backend Static File Serving

Since frontend is now on Render Static Site, update backend to NOT serve static files:

In `backend/app.js`, comment out the static file serving section:

```javascript
// ========================== 
// STATIC FILES & REACT ROUTING 
// ========================== 
// NOTE: Frontend is now deployed separately on Render Static Site
// Commenting out static file serving
/*
app.use(express.static(path.join(__dirname, "../frontend/dist"))); 
app.get("*", (req, res) => { 
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html")); 
});
*/
```

Then redeploy backend.

---

## ✅ Post-Deployment Verification Checklist

- [ ] Backend service is running (check `/health` endpoint)
- [ ] Database connection is working
- [ ] Frontend loads without errors
- [ ] Can register a new account
- [ ] Can log in with credentials
- [ ] Can create a new simulation
- [ ] Simulation results display correctly
- [ ] Can delete a simulation
- [ ] Can rerun a simulation
- [ ] No CORS errors in browser console
- [ ] No errors in Render logs

---

## 🐛 Troubleshooting Common Issues

### Issue: "CORS policy: origin is not allowed"

**Solution:**
1. Check that `FRONTEND_URL` environment variable is set correctly in Render backend dashboard
2. Verify URL matches your frontend Render URL exactly
3. Check console.log output in Render logs for CORS blocked messages

### Issue: "MongoDB connection error"

**Solution:**
1. Verify `MONGODB_URI` is correct in Render environment variables
2. Check MongoDB Atlas IP whitelist includes Render.com
3. Verify database username and password are correct
4. Check that cluster is running (not paused)

### Issue: "Cannot find module 'express'"

**Solution:**
1. Verify `build` command is: `cd backend && npm install`
2. Check that `package.json` dependencies are correct
3. Ensure `.gitignore` is NOT excluding `package.json`

### Issue: "Request timeout / AI service unreachable"

**Solution:**
1. Verify `AI_API_KEY` is set correctly
2. Check Groq API console to ensure key is active
3. Monitor Groq API status page

### Issue: "Application crashed"

**Solution:**
1. Check Render logs for error messages
2. Verify all required environment variables are set
3. Check that database connection is working (`/health` endpoint)
4. Review recent code changes for errors

---

## 🔒 Security Post-Deployment

### 1. MongoDB Atlas Security

- [ ] Set strong database password
- [ ] Restrict IP whitelist to only Render.com IPs (contact support for exact IPs)
- [ ] Enable authentication required
- [ ] Enable encryption in transit (TLS)
- [ ] Consider VPC peering for better security

### 2. Render.com Security

- [ ] Enable auto-deployments only from main branch
- [ ] Set up branch protection rules on GitHub
- [ ] Use environment variables for all secrets (never hardcode)
- [ ] Regularly update dependencies

### 3. Application Security

- [ ] Verify CORS is restrictive
- [ ] Check security headers are present
- [ ] Enable rate limiting
- [ ] Monitor for unusual login attempts

---

## 📈 Monitoring & Maintenance

### Regular Checks

Every week:
- [ ] Check Render dashboard for errors
- [ ] Monitor application performance
- [ ] Review logs for unusual activity

Every month:
- [ ] Update dependencies: `npm update`
- [ ] Backup MongoDB data
- [ ] Review security logs

---

## 🚀 Scaling (When Ready)

As your application grows:

1. **Database**: Upgrade MongoDB cluster from M0 to M2 or higher
2. **Backend**: Upgrade Render plan to support more concurrent connections
3. **Frontend**: Enable CDN caching
4. **Monitoring**: Add Sentry or similar error tracking
5. **Load Testing**: Use tools like Artillery or k6 to test capacity

---

## 📞 Support & Resources

- Render Documentation: https://render.com/docs
- MongoDB Atlas Help: https://docs.atlas.mongodb.com
- Groq API Documentation: https://console.groq.com/docs
- Express.js Guide: https://expressjs.com/

---

