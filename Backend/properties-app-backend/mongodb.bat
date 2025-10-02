@echo off

if "%1"=="start" (
    echo 🚀 Starting MongoDB...
    docker-compose up -d mongodb
    echo ✅ MongoDB started on port 27017
    echo 📊 Connection string: mongodb://localhost:27017/PropertiesApp
    goto :eof
)

if "%1"=="stop" (
    echo 🛑 Stopping MongoDB...
    docker-compose down
    echo ✅ MongoDB stopped
    goto :eof
)

if "%1"=="restart" (
    echo 🔄 Restarting MongoDB...
    docker-compose restart mongodb
    echo ✅ MongoDB restarted
    goto :eof
)

if "%1"=="logs" (
    echo 📋 Showing MongoDB logs...
    docker logs properties-mongodb
    goto :eof
)

if "%1"=="connect" (
    echo 🔌 Connecting to MongoDB...
    docker exec -it properties-mongodb mongosh PropertiesApp
    goto :eof
)

if "%1"=="status" (
    echo 📊 MongoDB status:
    docker ps --filter "name=properties-mongodb"
    goto :eof
)

if "%1"=="reset" (
    echo ⚠️  Removing MongoDB and all data...
    set /p confirm="Are you sure? (y/N): "
    if /i "%confirm%"=="y" (
        docker-compose down -v
        echo ✅ MongoDB and data removed
    ) else (
        echo ❌ Operation cancelled
    )
    goto :eof
)

echo 🐳 MongoDB Manager for Properties App
echo.
echo Usage: %0 {start^|stop^|restart^|logs^|connect^|status^|reset}
echo.
echo Commands:
echo   start    - Start MongoDB
echo   stop     - Stop MongoDB
echo   restart  - Restart MongoDB
echo   logs     - Show logs
echo   connect  - Connect with mongosh
echo   status   - View container status
echo   reset    - Remove container and data (⚠️ CAREFUL)
echo.
echo After 'start', run:
echo   dotnet run (to start the API)