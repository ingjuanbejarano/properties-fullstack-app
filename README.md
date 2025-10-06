# Properties App

A modern property management application built with .NET 9.0 and Next.js. This full-stack application allows users to manage properties and owners with a clean, responsive interface.

## 🏗️ Architecture

- **Backend**: .NET 9.0 Web API with MongoDB
- **Frontend**: Next.js 15.5.4 with React 19, TypeScript, and Tailwind CSS
- **Database**: MongoDB 7.0 running in Docker
- **State Management**: React Query (TanStack Query)
- **UI Components**: Custom components with shadcn/ui

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

> ⚠️ **IMPORTANT**: Make sure your local project path **does NOT contain spaces or special characters** (such as accents, ñ, symbols, etc.). This can cause crashes with Turbopack, Docker, npm, and other development tools.
> 
> ✅ **Recommended paths**: `C:\dev\properties-app` or `C:\projects\properties-app`  
> ❌ **Avoid paths like**: `C:\My Project\properties-app` or `C:\José's Projects\properties-app`

### Required Software

- **Docker Desktop** (latest version)
  - Download from [docker.com](https://www.docker.com/products/docker-desktop/)
  - Required for MongoDB database

- **.NET 9.0 SDK**
  - Download from [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/9.0)
  - Required for backend API

- **Node.js 18.x or later**
  - Download from [nodejs.org](https://nodejs.org/)
  - Required for frontend development

- **Git** (recommended)
  - Download from [git-scm.com](https://git-scm.com/)

### Verification Commands

```bash
# Verify Docker
docker --version

# Verify .NET
dotnet --version

# Verify Node.js
node --version

# Verify npm
npm --version
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Properties-app
```

### 2. Start the Database

```bash
cd Backend/properties-app-backend

# Start MongoDB in Docker
docker-compose up -d mongodb

# Configure replica set (required for transactions)
docker exec -it properties-mongodb mongosh --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]})"
```

### 3. Start the Backend API

```bash
# From Backend/properties-app-backend directory
dotnet restore
dotnet run
```

The API will be available at: `http://localhost:5007`

### 4. Configure Frontend Environment

```bash
cd propertiesfrontend

# Create environment file
echo "# API Configuration" > .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5007/api" >> .env.local
```

Or create the file manually:
```bash
# Create .env.local in propertiesfrontend/ directory
NEXT_PUBLIC_API_URL=http://localhost:5007/api
```

### 5. Start the Frontend

```bash
cd propertiesfrontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 📁 Project Structure

```
Properties-app/
├── Backend/
│   └── properties-app-backend/     # .NET 9.0 Web API
│       ├── Controllers/            # API controllers
│       ├── Data/                   # Entity Framework context
│       ├── Entities/               # Data models
│       ├── Models/                 # DTOs
│       ├── Repositories/           # Data access layer
│       ├── docker-compose.yml      # MongoDB configuration
│       └── README.md               # Backend documentation
├── propertiesfrontend/             # Next.js 15.5.4 application
│   ├── app/                        # App router pages
│   ├── components/                 # React components
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utilities and configurations
│   ├── providers/                  # Context providers
│   └── README.md                   # Frontend documentation
└── README.md                       # This file
```

## 🔧 Development Features

### Backend (.NET 9.0)
- **RESTful API** with Entity Framework Core
- **MongoDB integration** with Entity Framework provider
- **CRUD operations** for Properties and Owners
- **Image upload support** with GridFS
- **Swagger documentation** (development mode)
- **Health checks** and monitoring
- **Seed data** for development

### Frontend (Next.js 15.5.4)
- **App Router** with React 19
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query** for state management
- **Image upload** with preview
- **Responsive design** for mobile and desktop
- **Error handling** with toast notifications
- **Modal system** for forms
- **Property detail views** with navigation

## 🌐 API Endpoints

### Properties
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create property (with image)
- `GET /api/properties/{id}` - Get property by ID
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

### Owners
- `GET /api/owners` - List all owners
- `POST /api/owners` - Create owner
- `GET /api/owners/{id}` - Get owner by ID
- `PUT /api/owners/{id}` - Update owner
- `DELETE /api/owners/{id}` - Delete owner

## 🐳 Docker Commands

### MongoDB Management
```bash
# Start MongoDB
docker-compose up -d mongodb

# Stop MongoDB
docker-compose down

# View logs
docker logs properties-mongodb

# Connect to database
docker exec -it properties-mongodb mongosh PropertiesApp

# Complete reset (removes all data)
docker-compose down -v
```

## 🛠️ Development Commands

### Backend
```bash
cd Backend/properties-app-backend

# Restore packages
dotnet restore

# Run in development mode
dotnet run

# Run tests
dotnet test

# Build for production
dotnet build --configuration Release
```

### Frontend
```bash
cd propertiesfrontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB connection errors**
   - Ensure Docker Desktop is running
   - Verify MongoDB container is started: `docker ps`
   - Check replica set status: `docker exec -it properties-mongodb mongosh --eval "rs.status()"`

2. **Backend API not starting**
   - Verify .NET 9.0 SDK is installed
   - Check if MongoDB is running on port 27017
   - Review connection string in `appsettings.json`

3. **Frontend build errors**
   - Ensure Node.js 18+ is installed
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run type-check`

4. **Frontend API connection issues**
   - Verify `.env.local` file exists in `propertiesfrontend/` directory
   - Check that `NEXT_PUBLIC_API_URL=http://localhost:5007/api` is set correctly
   - Ensure backend API is running on port 5007
   - Open browser dev tools to check for CORS or network errors

5. **Port conflicts**
   - Backend: Default port 5007 (configurable in `launchSettings.json`)
   - Frontend: Default port 3000 (configurable with `-p` flag)
   - MongoDB: Default port 27017

## 📚 Additional Documentation

- [Backend README](Backend/properties-app-backend/README.md) - Detailed backend setup and API documentation
- [Frontend README](propertiesfrontend/README.md) - Frontend development guide and component documentation