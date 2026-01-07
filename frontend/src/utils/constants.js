// API Endpoints
export const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  PERSONNEL: `${API_BASE_URL}/api/personnel`,
  SKILLS: `${API_BASE_URL}/api/skills`,
  PROJECTS: `${API_BASE_URL}/api/projects`,
};

// Experience Levels
export const EXPERIENCE_LEVELS = [
  'Junior',
  'Mid-level',
  'Senior',
  'Lead',
  'Expert'
];

// Skill Proficiency Levels
export const PROFICIENCY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

// Project Statuses
export const PROJECT_STATUSES = [
  'Planning',
  'Active',
  'On Hold',
  'Completed',
  'Cancelled'
];

// Skill Categories
export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Mobile',
  'UI/UX',
  'Testing',
  'Security',
  'Analytics',
  'Other'
];