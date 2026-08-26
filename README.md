# Glow Finder™ | TriActive Brightening Serum Web Application

A modern, responsive, high-performance skincare e-commerce website built with React, Vite, and Tailwind CSS.

---

## 🚀 How to Deploy on Vercel

### Option 1: Deploy via GitHub (Recommended)
1. Push this project folder to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Glow Finder website"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **"Add New" > "Project"**.
3. Import your GitHub repository.
4. Vercel will auto-detect **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Your website will be live with an SSL HTTPS domain in seconds!

---

### Option 2: Deploy via Vercel CLI
1. Install Vercel CLI globally (if not installed):
   ```bash
   npm i -g vercel
   ```
2. Run the deployment command from the project root directory:
   ```bash
   vercel
   ```
3. For production deployment:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Local Development & Build

- Run development server:
  ```bash
  npm run dev
  ```
- Build production bundle:
  ```bash
  npm run build
  ```
- Preview production build locally:
  ```bash
  npm run preview
  ```
