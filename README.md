# 🎯 CFA Quantum - Next-Generation CFA Preparation Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/cfaquantum/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

> **Revolutionizing CFA exam preparation with AI-powered personalization, real-time battles, and comprehensive analytics.**

🌟 **Live Demo:** [https://cfaquantum.netlify.app](https://cfaquantum.netlify.app)

---

## 📋 **Table of Contents**

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [🌍 Environment Setup](#-environment-setup)
- [📊 Database Setup](#-database-setup)
- [🚀 Deployment](#-deployment)
- [📱 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 **Features**

### 🎓 **Core Learning Features**
- **📚 Practice Questions** - 10,000+ CFA questions across all levels
- **⏱️ Mock Exams** - Full-length timed practice exams
- **📋 Custom Quizzes** - Personalized question sets by topic
- **🔄 Adaptive Learning** - AI-powered difficulty adjustment
- **📊 Progress Tracking** - Detailed analytics and insights

### ⚔️ **Gamification & Social**
- **🏆 Real-time Battles** - Multiplayer quiz competitions
- **🏅 Achievement System** - Unlock badges and rewards
- **📈 Leaderboards** - Global and friend rankings
- **💬 Community Forum** - Discussion boards and study groups
- **👥 Study Partners** - Connect with other candidates

### 🎯 **Advanced Features**
- **🤖 AI Study Assistant** - Personalized study recommendations
- **📅 Study Planner** - Automated study schedule creation
- **🔥 Streak Tracking** - Daily study habit building
- **📱 Mobile PWA** - Offline study capabilities
- **📊 Advanced Analytics** - Performance insights and trends

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **State Management:** Zustand
- **Authentication:** NextAuth.js

### **Backend**
- **API:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + OAuth
- **File Storage:** Vercel Blob

### **Deployment**
- **Hosting:** Netlify
- **Database:** Supabase / Railway
- **CDN:** Cloudflare
- **Analytics:** Vercel Analytics

---

## ⚡ **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL database

### **1-Minute Setup**
```bash
# Clone the repository
git clone https://github.com/bhanukaranwal/cfa-quantum.git
cd cfa-quantum

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and secrets

# Generate Prisma client and setup database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev