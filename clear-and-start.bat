@echo off
echo 🧹 Clearing all development caches...

echo 📦 Clearing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo 🗑️ Clearing dist folder...
if exist dist rmdir /s /q dist

echo 🌐 Clearing browser cache files...
if exist .vite rmdir /s /q .vite
if exist .cache rmdir /s /q .cache

echo 🧽 Clearing temporary files...
del /q *.tmp 2>nul
del /q .DS_Store 2>nul

echo ✅ All caches cleared!
echo 🚀 Starting development server with --force flag...

npm run dev
