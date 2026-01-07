// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate required fields
export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

// Validate personnel form
export const validatePersonnelForm = (data) => {
  const errors = {};

  if (!validateRequired(data.name)) {
    errors.name = 'Name is required';
  }

  if (!validateRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!validateRequired(data.role)) {
    errors.role = 'Role is required';
  }

  return errors;
};

// Validate skill form
export const validateSkillForm = (data) => {
  const errors = {};

  if (!validateRequired(data.name)) {
    errors.name = 'Skill name is required';
  }

  if (!validateRequired(data.category)) {
    errors.category = 'Category is required';
  }

  if (!validateRequired(data.description)) {
    errors.description = 'Description is required';
  }

  return errors;
};

// Validate project form
export const validateProjectForm = (data) => {
  const errors = {};

  if (!validateRequired(data.name)) {
    errors.name = 'Project name is required';
  }

  if (!validateRequired(data.description)) {
    errors.description = 'Description is required';
  }

  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!data.endDate) {
    errors.endDate = 'End date is required';
  }

  if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
    errors.endDate = 'End date must be after start date';
  }

  return errors;
};

// Validate if a date is in the future
export const isFutureDate = (dateString) => {
  return new Date(dateString) > new Date();
};

// Validate password strength (if needed for user authentication)
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};