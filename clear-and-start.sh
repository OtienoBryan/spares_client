#!/bin/bash

# Development Cache Clearer and Server Starter
# This script clears all caches and starts the development server

echo "🧹 Clearing all development caches..."

# Clear Vite cache
echo "📦 Clearing Vite cache..."
rm -rf node_modules/.vite

# Clear dist folder
echo "🗑️ Clearing dist folder..."
rm -rf dist

# Clear browser cache files (if they exist)
echo "🌐 Clearing browser cache files..."
rm -rf .vite
rm -rf .cache

# Clear any temporary files
echo "🧽 Clearing temporary files..."
find . -name "*.tmp" -delete
find . -name ".DS_Store" -delete

echo "✅ All caches cleared!"
echo "🚀 Starting development server with --force flag..."

# Start the development server with force flag
npm run dev
