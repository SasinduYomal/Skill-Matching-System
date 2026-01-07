# Skill Matching System - Frontend

This is the frontend implementation of the Skill Matching System, built with React, Tailwind CSS, and Vite.

## Features

### 1. Personnel Management
- **Create Personnel**: Form with validation for name, email, role, and experience level
- **Read Personnel**: Paginated list/table of personnel with all details
- **Update Personnel**: Editable form with existing data pre-filled
- **Delete Personnel**: Confirmation modal before deletion
- **Search/Filter**: Personnel by name, role, or experience level
- **Display Creation Timestamp**

### 2. Skill Management
- **Skill Catalog CRUD**: Add, edit, delete skills with name, category, and description
- **List Skills**: Filterable list of all skills by category
- **Skill Assignment**: Multi-select skills for each personnel with proficiency levels

### 3. Project Management
- **Project Creation**: Form for new projects with name, description, start/end dates, and status
- **Project List**: Table view of all projects with sortable columns
- **Required Skills**: Assign multiple skills with minimum proficiency for each project
- **Edit/Delete Projects**: Full CRUD operations for projects

### 4. Matching Feature (UI)
- **Project Selection**: Interface to select a project for matching
- **Personnel Matching**: Display matched personnel list with:
  - Name & role
  - Skills that match
  - Proficiency levels
  - Match score/percentage
- **Sorting and Filtering**: Simple filters for the results

## Technology Stack

- **React**: Component-based UI library
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icon library
- **React Hot Toast**: Notification system
- **Axios**: HTTP client for API requests
- **Vite**: Fast build tool

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── comman/           # Common components (Header, Sidebar, Footer)
│   │   ├── matching/         # Matching interface components
│   │   ├── personnel/        # Personnel management components
│   │   ├── projects/         # Project management components
│   │   └── skills/           # Skills management components
│   ├── pages/                # Page components
│   ├── api/                  # API service files
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions and constants
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── public/                   # Static assets
├── package.json             # Project dependencies and scripts
└── tailwind.config.js       # Tailwind CSS configuration
```

## Setup and Installation

1. Make sure you have Node.js installed
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open your browser and go to `http://localhost:5173`

## API Integration

The frontend is configured to work with a backend API. The base URL is set to `http://localhost:3000/api` in `src/api/axiosInstance.js`. You can modify this to point to your actual backend server.

## Key Components

- **Dashboard**: Overview with statistics and quick actions
- **Personnel Management**: Complete CRUD operations for personnel
- **Skills Management**: Skill catalog with categorization
- **Project Management**: Project lifecycle management
- **Skill Matching**: Advanced matching algorithm UI

## Customization

The application is built with flexibility in mind. You can easily customize:
- Styling using Tailwind CSS classes
- Components by modifying the React components
- API endpoints in the service files
- Validation rules in the utility files
- Icons using the Lucide React library

## Responsive Design

The application is fully responsive and works on desktop, tablet, and mobile devices. The sidebar collapses on smaller screens and becomes a drawer that can be toggled.

## Security Considerations

- Authentication token handling via interceptors
- Unauthorized access redirection
- Input validation on forms
- Secure API communication