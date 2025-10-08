#!/bin/bash

# Chromebook Tester - MongoDB Startup Script
echo "🚀 Starting MongoDB for Chromebook Tester..."

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "📦 Using Docker to start MongoDB..."
    
    # Check if MongoDB container is already running
    if docker ps | grep -q "mongo"; then
        echo "✅ MongoDB container is already running!"
    else
        # Start MongoDB container
        echo "🔄 Starting MongoDB container..."
        docker run -d \
            --name chromebook-mongo \
            -p 27017:27017 \
            -e MONGO_INITDB_DATABASE=chromebook-tester \
            mongo:7
        
        if [ $? -eq 0 ]; then
            echo "✅ MongoDB started successfully!"
            echo "📍 Connection string: mongodb://localhost:27017/chromebook-tester"
        else
            echo "❌ Failed to start MongoDB container"
            exit 1
        fi
    fi
else
    echo "⚠️  Docker not found. Please install Docker or start MongoDB manually."
    echo "📋 Manual MongoDB setup:"
    echo "   1. Install MongoDB: https://docs.mongodb.com/manual/installation/"
    echo "   2. Start MongoDB service"
    echo "   3. Create database: chromebook-tester"
    echo "   4. Connection string: mongodb://localhost:27017/chromebook-tester"
fi

echo ""
echo "🎯 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:3000"
echo "   3. Test the application!"
