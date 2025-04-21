#!/bin/bash

# Script to submit sitemap to search engines
# This helps search engines discover your site faster

# Set your sitemap URL
SITEMAP_URL="https://nbkrstudenthub.me/sitemap.xml"

# Submit to Google
echo "Submitting sitemap to Google..."
curl "https://www.google.com/ping?sitemap=$SITEMAP_URL"
echo -e "\n"

# Submit to Bing
echo "Submitting sitemap to Bing..."
curl "https://www.bing.com/ping?sitemap=$SITEMAP_URL"
echo -e "\n"

echo "Sitemap submission complete!"
echo "Note: You should also manually submit your sitemap in Google Search Console and Bing Webmaster Tools for better tracking."
