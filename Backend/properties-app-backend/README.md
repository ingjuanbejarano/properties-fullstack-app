# Docker MongoDB Setup for Properties App

This project is configured to use MongoDB in Docker for local development, while the .NET API runs directly on your machine.

## Prerequisites

- Docker Desktop installed and running
- .NET 9.0 SDK installed

## MongoDB Configuration

### 1. Start MongoDB with Docker Compose

```bash
# From the backend directory
cd Backend/properties-app-backend

# Start only MongoDB
docker-compose up -d mongodb
```

### 2. Verify MongoDB is running

```bash
# View running containers
docker ps

# View MongoDB logs
docker logs properties-mongodb

# Connect to MongoDB to verify
docker exec -it properties-mongodb mongosh
```

### 3. Run the .NET API locally

```bash
# From the backend directory
dotnet run
```

## Connection Strings

- **Local development**: `mongodb://localhost:27017/PropertiesApp`
- **From Docker**: `mongodb://mongodb:27017/PropertiesApp`

## Useful Commands

### MongoDB Container Management

```bash
# Start MongoDB
docker-compose up -d mongodb

# Stop MongoDB
docker-compose down

# View logs
docker logs properties-mongodb

# Restart MongoDB
docker-compose restart mongodb

# Remove container and data
docker-compose down -v
```

### Direct MongoDB Access

```bash
# Connect with mongosh
docker exec -it properties-mongodb mongosh

# Connect to specific database
docker exec -it properties-mongodb mongosh PropertiesApp
```

### Useful MongoDB Commands

Once connected with mongosh:

```javascript
// View databases
show dbs

// Use the database
use PropertiesApp

// View collections
show collections

// View documents in properties
db.properties.find()

// Count documents
db.properties.countDocuments()
```

## Project Structure

```
Backend/
├── docker-compose.yml          # MongoDB-only configuration
├── Dockerfile                  # For API build (optional)
├── README.md                   # This file
└── properties-app-backend/     # API source code
```

## Advantages of this Configuration

1. **Isolated MongoDB**: Database in container, easy to reset
2. **API in development**: Direct debugging, hot reload
3. **Persistence**: Data persists between restarts
4. **Portability**: Easy to share DB configuration

## Troubleshooting

### MongoDB won't start
```bash
# View detailed logs
docker logs properties-mongodb

# Restart container
docker-compose restart mongodb
```

### Connection issues
- Verify port 27017 is not occupied
- Confirm Docker Desktop is running
- Review connection string in appsettings.json

### Complete data reset
```bash
# Stop and remove container with data
docker-compose down -v

# Recreate
docker-compose up -d mongodb
```