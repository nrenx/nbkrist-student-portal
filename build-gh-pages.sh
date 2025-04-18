#!/bin/bash

# Exit on error
set -e

echo "Building for GitHub Pages..."

# Check for required environment variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_KEY" ]; then
  echo "Error: Required environment variables VITE_SUPABASE_URL and VITE_SUPABASE_KEY must be set."
  echo "Please set these variables in your environment or CI/CD pipeline."
  exit 1
fi

# Create .env.production file with environment variables
echo "Creating .env.production file from environment variables..."
echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" > .env.production
echo "VITE_SUPABASE_KEY=$VITE_SUPABASE_KEY" >> .env.production
echo "VITE_SUPABASE_STORAGE_BUCKET=${VITE_SUPABASE_STORAGE_BUCKET:-student_data}" >> .env.production

# Clean build directory
echo "Cleaning build directory..."
rm -rf dist

# Build the project
echo "Building project..."
npm run build

# Ensure CNAME file exists if you have a custom domain
# echo "yourdomain.com" > dist/CNAME

# Ensure .nojekyll file exists to prevent Jekyll processing
touch dist/.nojekyll

# With HashRouter, we don't need a 404.html file
# But we'll keep it just in case
echo "Copying 404.html to dist..."
cp public/404.html dist/

# Create a debug.js file only if DEBUG=true is set
if [ "$DEBUG" = "true" ]; then
  echo "Creating debug.js file..."
  cat > dist/debug.js << 'EOL'
(function() {
  console.log('Debug script loaded');

  // Log environment information
  console.log('URL:', window.location.href);
  console.log('Path:', window.location.pathname);
  console.log('User Agent:', navigator.userAgent);

  // Create a visible debug panel
  var debugDiv = document.createElement('div');
  debugDiv.style.position = 'fixed';
  debugDiv.style.bottom = '10px';
  debugDiv.style.right = '10px';
  debugDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  debugDiv.style.color = 'white';
  debugDiv.style.padding = '10px';
  debugDiv.style.borderRadius = '5px';
  debugDiv.style.zIndex = '9999';
  debugDiv.style.fontSize = '12px';
  debugDiv.style.maxWidth = '300px';
  debugDiv.style.maxHeight = '200px';
  debugDiv.style.overflow = 'auto';

  debugDiv.innerHTML = '<h3>Debug Info</h3>' +
                      '<p>URL: ' + window.location.href + '</p>' +
                      '<p>Path: ' + window.location.pathname + '</p>' +
                      '<button id="debug-toggle" style="background: #555; border: none; color: white; padding: 5px 10px; border-radius: 3px;">Hide</button>';

  // Add to body when it's ready
  function addDebugPanel() {
    if (document.body) {
      document.body.appendChild(debugDiv);

      // Add toggle functionality
      document.getElementById('debug-toggle').addEventListener('click', function() {
        if (this.textContent === 'Hide') {
          debugDiv.style.height = '30px';
          debugDiv.style.overflow = 'hidden';
          this.textContent = 'Show';
        } else {
          debugDiv.style.height = 'auto';
          debugDiv.style.maxHeight = '200px';
          this.textContent = 'Hide';
        }
      });
    } else {
      setTimeout(addDebugPanel, 100);
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDebugPanel);
  } else {
    addDebugPanel();
  }

  // Global error handler
  window.addEventListener('error', function(event) {
    // Ignore errors from Chrome extensions
    if (event.filename && event.filename.startsWith('chrome-extension://')) {
      console.log('Ignoring error from Chrome extension:', event.filename);
      return;
    }

    console.error('Caught error:', event.error);
    if (debugDiv) {
      var errorMsg = document.createElement('div');
      errorMsg.style.color = '#ff6666';
      errorMsg.style.marginTop = '5px';
      errorMsg.textContent = 'Error: ' + event.message + ' at ' + event.filename + ':' + event.lineno;
      debugDiv.appendChild(errorMsg);
    }
  });
})();
EOL

  # Add debug script to index.html
  echo "Adding debug script to index.html..."
  sed -i '' -e 's/<\/body>/<script src="\/nbkrist-student-portal\/debug.js"><\/script><\/body>/' dist/index.html
  echo "Debug mode enabled."
fi

echo "Build completed successfully!"
echo "You can now deploy the 'dist' directory to GitHub Pages."
