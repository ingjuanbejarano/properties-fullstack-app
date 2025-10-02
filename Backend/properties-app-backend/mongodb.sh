#!/bin/bash

# Script to manage MongoDB in Docker for Properties App

case "$1" in
    start)
        echo "🚀 Starting MongoDB..."
        docker-compose up -d mongodb
        echo "✅ MongoDB started on port 27017"
        echo "📊 Connection string: mongodb://localhost:27017/PropertiesApp"
        ;;
    stop)
        echo "🛑 Stopping MongoDB..."
        docker-compose down
        echo "✅ MongoDB stopped"
        ;;
    restart)
        echo "🔄 Restarting MongoDB..."
        docker-compose restart mongodb
        echo "✅ MongoDB restarted"
        ;;
    logs)
        echo "📋 Showing MongoDB logs..."
        docker logs properties-mongodb
        ;;
    connect)
        echo "🔌 Connecting to MongoDB..."
        docker exec -it properties-mongodb mongosh PropertiesApp
        ;;
    status)
        echo "📊 MongoDB status:"
        docker ps --filter "name=properties-mongodb"
        ;;
    reset)
        echo "⚠️  Removing MongoDB and all data..."
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            echo "✅ MongoDB and data removed"
        else
            echo "❌ Operation cancelled"
        fi
        ;;
    *)
        echo "🐳 MongoDB Manager for Properties App"
        echo ""
        echo "Usage: $0 {start|stop|restart|logs|connect|status|reset}"
        echo ""
        echo "Commands:"
        echo "  start    - Start MongoDB"
        echo "  stop     - Stop MongoDB"
        echo "  restart  - Restart MongoDB"
        echo "  logs     - Show logs"
        echo "  connect  - Connect with mongosh"
        echo "  status   - View container status"
        echo "  reset    - Remove container and data (⚠️ CAREFUL)"
        echo ""
        echo "After 'start', run:"
        echo "  dotnet run (to start the API)"
        exit 1
        ;;
esac