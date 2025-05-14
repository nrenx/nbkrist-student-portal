#!/bin/bash

# Script to submit sitemap to search engines
# This helps search engines discover your site faster

# Set your sitemap URL
SITEMAP_URL="https://nbkrstudenthub.me/sitemap.xml"

# Print current date and time
echo "Submitting sitemap on $(date)"
echo "-----------------------------------"

# Note about Google
echo "Note: Google has deprecated the ping method for sitemaps."
echo "Please submit your sitemap manually through Google Search Console:"
echo "https://search.google.com/search-console"
echo -e "\n"

# Submit to Bing
echo "Submitting sitemap to Bing..."
curl "https://www.bing.com/ping?sitemap=$SITEMAP_URL"
echo -e "\n"

# Submit to Yandex
echo "Submitting sitemap to Yandex..."
curl "https://webmaster.yandex.com/ping?sitemap=$SITEMAP_URL"
echo -e "\n"

echo "Sitemap submission complete!"
echo "-----------------------------------"
echo "Important: You should also manually submit your sitemap in:"
echo "1. Google Search Console: https://search.google.com/search-console"
echo "2. Bing Webmaster Tools: https://www.bing.com/webmasters"
echo "3. Yandex Webmaster: https://webmaster.yandex.com"
echo "This will provide better tracking and ensure your site is properly indexed."
