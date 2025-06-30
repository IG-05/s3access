# S3 Access Manager - System Architecture

## Overview

This application is a secure, role-based S3 access management system built with a modern full-stack architecture. It provides controlled access to AWS S3 resources through distinct user interfaces for regular users and administrators, with authentication handled through AWS Cognito.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Authentication**: AWS Cognito Identity JavaScript SDK
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: AWS Cognito integration with custom middleware
- **API Design**: RESTful API with role-based access control
- **File Storage**: AWS S3 integration for bucket management
- **Development**: Hot module replacement with Vite integration

### Database Schema
The application uses a relational database with the following core entities:
- **Users**: Stores Cognito user information and role assignments
- **S3 Buckets**: Catalog of available S3 buckets with metadata
- **Bucket Permissions**: Junction table managing user access levels to buckets
- **Access Requests**: Temporary access request workflow with approval system

## Key Components

### Authentication System
- **AWS Cognito Integration**: Handles user authentication and group-based authorization
- **JWT Token Management**: Secure token storage and automatic refresh
- **Role-Based Access**: Differentiates between 'user' and 'admin' roles
- **Middleware Protection**: Server-side route protection with token validation

### User Interface Components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dashboard Interfaces**: Separate user and admin dashboards with role-appropriate features
- **Data Tables**: Interactive tables for bucket management and access request handling
- **Form Components**: Reusable form elements with validation and error handling

### S3 Integration
- **Bucket Discovery**: Automatic S3 bucket enumeration and metadata collection
- **Access Control**: Fine-grained permission management (read/write/admin levels)
- **Request Workflow**: Temporary access request system with time-based expiration

## Data Flow

1. **Authentication Flow**:
   - User authenticates via AWS Cognito
   - JWT tokens are stored client-side
   - Server validates tokens and creates/updates user records
   - Role determination based on Cognito groups

2. **Authorization Flow**:
   - Middleware checks user authentication on protected routes
   - Role-based access control determines available features
   - Admin users have access to all management functions

3. **Request Management**:
   - Users can request access to restricted buckets
   - Admins review and approve/deny requests
   - Approved requests create time-limited permissions
   - System tracks access patterns and usage

## External Dependencies

### AWS Services
- **AWS Cognito**: User authentication and management
- **AWS S3**: Object storage and bucket management
- **AWS STS**: Security token service for temporary credentials

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migrations and schema management

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

The application is designed for deployment on Replit with the following characteristics:
- **Single Repository**: Monorepo structure with shared types and schemas
- **Environment Variables**: AWS credentials and database connection strings
- **Build Process**: Separate client and server builds with static asset serving
- **Development Mode**: Hot reloading with Vite integration
- **Production Mode**: Optimized builds with Express static file serving

The build process creates a `dist` directory containing:
- Client-side assets in `dist/public`
- Server bundle as `dist/index.js`

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
- June 30, 2025. Implemented AWS Cognito hosted UI authentication
  - Configured Cognito domain: https://w3vhnpm5d.auth.us-east-1.amazoncognito.com
  - Added OAuth/OIDC flow with callback handling
  - Simplified login page with secure AWS authentication
- June 30, 2025. Completed migration from Replit Agent to Replit environment
  - Fixed authentication system to use JWT token decoding instead of AWS API calls
  - Resolved OAuth scope issues by switching from access tokens to ID tokens
  - Updated client-server authentication flow for proper token handling
  - All dependencies installed and application running successfully
- June 30, 2025. Enhanced UI and implemented bucket exploration
  - Replaced modal-based bucket viewing with dedicated explorer page (/bucket/:bucketName)
  - Fixed UI overlapping issues by removing absolute positioning
  - Implemented Cognito group-based access control for bucket permissions
  - Added comprehensive bucket object browsing with search functionality
  - Enhanced authentication to track and update user Cognito groups
  - Improved overall application responsiveness and professional styling
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```