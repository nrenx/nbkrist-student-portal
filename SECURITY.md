# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by sending an email to [your-email@example.com](mailto:your-email@example.com). Please do not create public GitHub issues for security vulnerabilities.

We take all security vulnerabilities seriously. Once you've reported a vulnerability, we will:

1. Confirm receipt of your vulnerability report
2. Assess the impact and severity of the vulnerability
3. Work on a fix and release timeline
4. Notify you when the vulnerability has been fixed

## Secure Development Practices

This project follows these security practices:

1. **Environment Variables**: Sensitive information like API keys and credentials are stored in environment variables, not in the codebase.
2. **GitHub Secrets**: For CI/CD workflows, we use GitHub Secrets to securely store and access sensitive information.
3. **Limited Logging**: We avoid logging sensitive information, especially in production environments.
4. **Dependency Management**: We regularly update dependencies to address known vulnerabilities.

## Setting Up Your Own Instance Securely

When setting up your own instance of this project:

1. **Never commit sensitive information** to your repository.
2. Create a `.env` file based on the `.env.example` template and add your actual credentials there.
3. Make sure your `.env` file is included in `.gitignore` to prevent accidental commits.
4. For GitHub Pages deployment, set up the required secrets in your repository settings.

## Required GitHub Secrets for Deployment

If you're using GitHub Actions for deployment, you'll need to set up the following secrets:

1. `VITE_SUPABASE_URL`: Your Supabase project URL
2. `VITE_SUPABASE_KEY`: Your Supabase anon/public key (NOT the service role key)
3. `VITE_SUPABASE_STORAGE_BUCKET`: Your Supabase storage bucket name (optional, defaults to 'student_data')

To add these secrets:
1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret" and add each of the secrets above
