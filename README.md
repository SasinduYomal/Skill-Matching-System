# Skill Matching System

A comprehensive full-stack application that matches personnel with projects based on their skills and proficiency levels. The system allows administrators to manage personnel, skills, and projects while providing an efficient matching algorithm to connect the right people with the right projects.

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Sequelize** - ORM for database operations
- **MySQL** - Relational database management system

### Frontend
- **React** - JavaScript library for building user interfaces
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notification library

## Prerequisites

### Required Software
- **Node.js** v18.x or higher
- **npm** v8.x or higher
- **MySQL** v8.x or higher

### Database Setup
1. Install and start MySQL server locally
2. Create a MySQL user with appropriate permissions
3. Update the `.env` file with your database credentials

## How to Run the Application

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Skill_Matching_Systems
```

### 2. Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=skill_matching_db
DB_PORT=3306
PORT=5000
```

4. Run the database schema:
```bash
# Connect to MySQL and execute the database.sql file
mysql -u your_username -p < database.sql
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend application will start on `http://localhost:5173` (or another available port)

### 4. Application Access
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/`

## Features

### Personnel Management
- Add, edit, and delete personnel
- Assign skills with proficiency levels
- View personnel with their associated skills

### Skills Management
- Create and manage skills
- Categorize skills (Programming Language, Framework, Cloud, etc.)
- Assign skills to personnel

### Project Management
- Create and manage projects
- Define required skills for projects
- Track project status and timelines

### Matching Algorithm
- Automatically match personnel to projects based on skills
- Consider proficiency levels and experience
- Visual dashboard for resource allocation

## API Endpoints

### Personnel
- `GET /api/personnel` - Get all personnel
- `POST /api/personnel` - Create new personnel
- `GET /api/personnel/:id` - Get personnel by ID
- `PUT /api/personnel/:id` - Update personnel
- `DELETE /api/personnel/:id` - Delete personnel
- `GET /api/personnel/full-details` - Get personnel with skills
- `POST /api/personnel/:id/skills` - Assign skills to personnel

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `GET /api/skills/:id` - Get skill by ID
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Database Schema

The application uses a normalized database schema with the following main tables:

- `personnel` - Stores personnel information
- `skills` - Stores skill definitions
- `projects` - Stores project information
- `personnel_skills` - Junction table for personnel-skill relationships
- `project_skills` - Junction table for project-skill relationships

For complete schema details, see the `database.sql` file.

## Environment Variables

The application requires the following environment variables in the backend `.env` file:

- `DB_HOST` - Database host (default: localhost)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_PORT` - Database port (default: 3306)
- `PORT` - Server port (default: 5000)