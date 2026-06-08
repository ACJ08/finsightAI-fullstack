# Backend Deployment Guide - FinSight AI

## Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file from template
cp .env.example .env

# 3. Fill in .env with your values:
# - MONGODB_URI from MongoDB Atlas
# - JWT_SECRET (generate: openssl rand -base64 32)
# - AI_API_KEY from Groq API console
# - FRONTEND_URL (local: http://localhost:5173)

# 4. Start development server
npm start

# Server runs on: http://localhost:3000
```

### Production Deployment

#### Option 1: Using Render.com (Recommended)

1. **Connect GitHub Repository**
   - Go to [render.com](https://render.com)
   - Connect your GitHub account
   - Select `finsightAI-fullstack` repository

2. **Create Web Service**
   - Click "New+" → Web Service
   - Select your repository
   - Configure:
     - **Name**: `finsight-api`
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `node backend/app.js`

3. **Set Environment Variables** (in Render Dashboard)
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finsight?retryWrites=true&w=majority
   JWT_SECRET=<generate with: openssl rand -base64 32>
   AI_API_KEY=<from console.groq.com>
   FRONTEND_URL=https://your-frontend.onrender.com
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Your API is live at: `https://finsight-api-xxxx.onrender.com`

#### Option 2: Docker Deployment

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

Then deploy using your container platform.

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port (Render assigns this) | 3000 |
| `NODE_ENV` | Environment mode | production |
| `MONGODB_URI` | MongoDB Atlas connection | mongodb+srv://... |
| `JWT_SECRET` | Token signing secret | random base64 string |
| `AI_API_KEY` | Groq API key | gsk_... |
| `FRONTEND_URL` | CORS allowed origin | https://frontend.onrender.com |
| `LOG_LEVEL` | Log verbosity | info |

---

## Health Checks

The backend exposes two health check endpoints:

### `/health` - Detailed Status
```bash
curl https://your-api.onrender.com/health

# Response:
{
  "status": "healthy",
  "timestamp": "2024-06-08T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### `/ping` - Simple Ping
```bash
curl https://your-api.onrender.com/ping

# Response:
{ "status": "pong", "timestamp": "2024-06-08T..." }
```

---

## API Routes

### Authentication
- `POST /api/register` - Create new user account
- `POST /api/login` - Login and get JWT token

### Simulations
- `GET /api/get-all-sims` - Get user's simulations
- `GET /api/get-sim/:simId` - Get single simulation
- `POST /api/new-sim` - Create new simulation
- `PUT /api/rerun-sim/:simId` - Rerun simulation
- `DELETE /api/delete-sim/:simId` - Delete simulation

All routes except `/api/register` and `/api/login` require JWT authentication.

---

## Troubleshooting

### "MongoDB connection failed"
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist includes Render.com
- Ensure database user exists and password is correct

### "Cannot find module 'express'"
- Verify build command: `cd backend && npm install`
- Check `package.json` is in git (not in .gitignore)

### "CORS errors in frontend"
- Verify `FRONTEND_URL` environment variable is set
- URL must exactly match your frontend URL
- Check browser console for specific origin

### "Port already in use"
- Render dynamically assigns PORT variable
- Don't hardcode ports in code

---

## Monitoring & Logs

View logs in Render Dashboard:
1. Go to your Web Service
2. Click "Logs" tab
3. Filter by severity/date as needed

Key log messages to look for:
- ✅ "MongoDB connected successfully" - Database is working
- ❌ "CRITICAL: MongoDB connection failed" - Database configuration error
- 🚨 "CORS BLOCKED" - Frontend URL not in allowlist

---

## Performance Optimization

### Database Optimization
- Indexes are automatically created on: `uuid`, `user`, `project_name`
- Connection pooling: 2-10 connections

### Caching
- Cache GET responses with `Cache-Control` headers
- Rate limit login attempts (5 per 15 min per IP)

### Scaling
When traffic increases:
1. Upgrade Render plan
2. Consider adding Redis cache
3. Optimize database queries
4. Use CDN for static files

---

## Security Checklist

- [ ] All secrets in Render environment variables (not in code)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] HTTPS only (Render provides free SSL)
- [ ] Security headers enabled
- [ ] Rate limiting active
- [ ] Input validation enforced
- [ ] CORS properly configured

---

## Support

- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Groq API Docs: https://console.groq.com/docs
- Node.js Docs: https://nodejs.org/docs

---

