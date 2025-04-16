# NBKRIST Student Portal

A web application for NBKRIST students to access their academic information, attendance records, and examination results.

## Features

- Student information lookup by roll number
- View attendance records
- Check mid-term marks
- Report issues with the portal
- Mobile-responsive design

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- React Router
- shadcn-ui components
- Tailwind CSS

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Setup

```sh
# Clone the repository
git clone https://github.com/yourusername/nbkrist-student-portal.git

# Navigate to the project directory
cd nbkrist-student-portal

# Install dependencies
npm install

# Start the development server
npm run dev
```

The development server will start at http://localhost:5173

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages.

### Automatic Deployment

The project includes a GitHub Actions workflow that automatically deploys the site to GitHub Pages whenever changes are pushed to the main branch.

1. Push your changes to the main branch
2. GitHub Actions will build and deploy the site
3. Your site will be available at https://yourusername.github.io/nbkrist-student-portal/

### Manual Deployment

You can also deploy manually using the gh-pages package:

```sh
# Build and deploy the site
npm run deploy
```

## Project Structure

- `src/` - Source code
  - `components/` - Reusable UI components
  - `pages/` - Page components
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
