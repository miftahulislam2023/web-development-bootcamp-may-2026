#!/bin/bash

echo "Starting Render build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema
echo "Pushing database schema..."
npx prisma db push

# Build the Next.js application
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!"