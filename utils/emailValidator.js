import disposableEmailDomains from '../data/disposable-email-domains.json';

export const isValidEmail = (email) => {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  // Check for disposable email domains
  const domain = email.split('@')[1].toLowerCase();
  if (disposableEmailDomains.domains.includes(domain)) {
    return {
      isValid: false,
      error: 'Temporary or disposable email addresses are not allowed'
    };
  }

  return {
    isValid: true,
    error: null
  };
}; 