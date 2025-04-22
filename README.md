# 🎓 NBKRIST Student Portal

A modern web app that helps NBKRIST students access their academic data easily—without needing a login. Built using smart automation, AI tools, and clean UI design.

Hosted at: https://nbkrstudenthub.me/

## ✨ Features

- 🔍 Student info lookup by Roll Number
- 📊 View Attendance Records
- 📝 Check Mid-term Marks
- ⚙️ Scraped from official Teacher Portal using Python scripts
- ⚡ Fast, mobile-responsive, and optimized with Google AdSense

## 💡 Background

The official student portal lacked essential data like attendance and mid marks. After my suggestions were ignored, I discovered that teachers had a separate portal with all the info.

Using AI tools and a shared teacher login:

- I built Python scrapers to extract attendance, marks, and personal data.
- Uploaded data into Supabase via a structured script.
- Created a modern React-based site where students can check their info by just entering their roll number.

Monetized the solution using Google AdSense—turning a college flaw into an opportunity.

## 🛠️ Technologies Used

- **Frontend**: Vite, TypeScript, React, React Router
- **UI**: shadcn/ui components, Tailwind CSS
- **Backend**: Supabase (DB + Auth)
- **Scripting**: Python (for data scraping & uploading)
- **AI Tools**: ChatGPT, Claude, Sonnet, Lovable v0, etc.

## ⚙️ Development Setup

### Prerequisites

- Node.js (v18+)
- npm (v8+)

### Installation

```sh
# Clone the repository
git clone https://github.com/nrenx/nbkrist-student-portal.git

# Navigate to the project directory
cd nbkrist-student-portal

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env

# Edit the .env file with your Supabase credentials
# VITE_SUPABASE_URL=your_supabase_url_here
# VITE_SUPABASE_KEY=your_supabase_anon_key_here

# Start the development server
npm run dev
```

The development server will start at http://localhost:5173

## 🚀 Deployment

### Auto Deployment via GitHub Actions

1. Go to Settings > Secrets and Variables > Actions in your GitHub repo

2. Add the following secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_KEY`
   - `VITE_SUPABASE_STORAGE_BUCKET` (optional)

On every push to main, GitHub Actions will deploy the latest build.

### Manual Deployment

You can also deploy manually using the gh-pages package:

```sh
# Set required environment variables first
export VITE_SUPABASE_URL=your_supabase_url
export VITE_SUPABASE_KEY=your_supabase_key

# Build and deploy the site
npm run deploy
```

## 🧱 Project Structure

```
src/
│
├── components/    # Reusable UI elements
├── pages/         # Main route pages
├── hooks/         # Custom React hooks
└── lib/           # Utility functions
```

## 🤝 Contributing

1. Fork the repo

2. Create your feature branch
```
git checkout -b feature/amazing-feature
```

3. Commit your changes
```
git commit -m 'Add some amazing feature'
```

4. Push to GitHub
```
git push origin feature/amazing-feature
```

5. Open a Pull Request
