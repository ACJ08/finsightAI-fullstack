Here’s your **revised, polished, and more professionally framed README.md** with your contribution + finalist achievement properly integrated (without sounding exaggerated or unbalanced):

---

# 📘 FinSight AI — Next-Gen Prototyping Platform

**Empowering Philippine Banks to Serve MSMEs through AI-Powered Market Simulation**

---

## 🚀 Overview

FinSight AI is a fullstack AI-powered simulation platform designed to help banks rapidly prototype, test, and evaluate financial products for MSMEs (Micro, Small, and Medium Enterprises).

It enables product teams to simulate market behavior, assess adoption likelihood, and evaluate compliance risks using AI-driven synthetic MSME profiles.

This project was developed for the **BPI Data Wave Hackathon 2025**, where it was recognized as a **Top 6 Finalist**.

---

## 👥 Team (Alt + F4)

* Ferrer, Juan Marcus V.
* Jonson, Anne Carol G.
* Luna, Ian Charel V.
* Mendoza, Kyran Xandre O.

---

## 🏆 Achievement

* 🏅 **Top 6 Finalist — BPI Data Wave Hackathon 2025**

---

## 🧠 Problem Statement

Micro, Small, and Medium Enterprises (MSMEs) make up **99.6% of businesses in the Philippines**, yet receive only **4.1% of total bank lending**, creating a major financing gap.

Traditional banking product development is:

* Slow (6–8 months per cycle)
* Manual and fragmented
* Highly risk-averse due to compliance constraints

This limits innovation in MSME financial services.

---

## 💡 Solution: FinSight AI

FinSight AI introduces an **AI-powered simulation engine** that allows banks to:

* Prototype financial products instantly
* Simulate MSME behavior using AI agents
* Evaluate risk and compliance early
* Compare multiple product scenarios

This reduces product development cycles from **6–8 months to 3–4 months**.

---

## ⚙️ Tech Stack

### Frontend

* React.js
* Recharts
* Vite / React UI Components

### Backend

* Node.js (Express)
* JWT Authentication
* REST API architecture

### AI Layer

* OpenAI API (simulation engine)
* Synthetic MSME behavioral modeling

### Database

* MongoDB Atlas (Cloud)
* Mongoose ODM

### Deployment

* Frontend: Render / Vercel
* Backend: Render Web Service
* Database: MongoDB Atlas

---

## 🏗️ System Architecture

```text
Frontend (React)
      ↓
Backend (Node.js / Express)
      ↓
AI Simulation Engine (OpenAI API)
      ↓
MongoDB Atlas (Database)
```

---

## 📊 Features

### 🧩 No-Code Simulation Dashboard

* Create financial product scenarios
* Run AI-powered simulations instantly

### 🤖 AI Simulation Engine

* Generates MSME behavioral responses
* Predicts adoption likelihood

### 📈 Analytics & Visualization

* Charts for adoption scores
* Risk and compliance breakdown
* Scenario comparison dashboard

### 🔐 Authentication System

* JWT-based login/register
* User-specific simulation storage

---

## 🧪 Prototype Testing

* Used synthetic MSME profiles (e.g., sari-sari store, agri-supplier)
* Simulated 10+ financial product scenarios
* Role-play testing by hackathon team members
* Focused on usability and simulation accuracy

---

## 👩‍💻 Individual Contribution

While the project was developed collaboratively, **Anne Carol G. Jonson** significantly contributed to:

* Revamping and restructuring the fullstack architecture
* Integrating frontend and backend systems into a unified platform
* Fixing critical bugs and deployment issues
* Migrating database from local MongoDB to MongoDB Atlas
* Preparing backend for production deployment on Render
* Ensuring end-to-end system functionality and stability

---

## 📦 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/finsight-ai.git
cd finsight-ai
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

### Backend

* Hosted on **Render**
* Node.js + Express API server

### Frontend

* Hosted on **Render / Vercel**

### Database

* MongoDB Atlas cloud cluster

---

## 📌 Key Results

* Successfully simulated **10+ product scenarios**
* Reduced prototyping cycle from **6–8 months → 3–4 months**
* Enabled early-stage risk and compliance assessment
* Demonstrated feasibility of AI-powered banking innovation
* Recognized as **Top 6 Finalist** in BPI Data Wave Hackathon 2025

---

## ⚠️ Limitations

* Uses synthetic MSME data (no real BPI dataset access)
* AI simulation is prototype-level
* No live integration with BSP/DTI APIs
* Limited training data due to hackathon constraints

---

## 🚀 Future Improvements

* Integration with real MSME banking datasets (BPI, BizLink, Ka-Negosyo)
* Advanced AI agents for deeper behavioral modeling
* Real-time API connections to financial institutions
* Scalable cloud deployment with load balancing

---


## ⭐ FinSight AI Vision

> “Accelerating financial inclusion by enabling banks to safely simulate, test, and deploy MSME-focused financial products using AI-driven insights.”

---

## 📍 Status

```text
✔ Backend: Production-ready (Render deployed)
✔ Database: MongoDB Atlas connected
✔ Frontend: Fully integrated React app
✔ API: JWT-secured REST system
```

