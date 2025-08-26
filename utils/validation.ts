export const ValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Username must be 3-20 characters, letters, numbers, and underscores only',
  },
  displayName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'Display name must be 2-50 characters',
  },
  bio: {
    maxLength: 150,
    message: 'Bio must be less than 150 characters',
  },
  postContent: {
    required: true,
    maxLength: 2200,
    message: 'Post content must be less than 2200 characters',
  },
  comment: {
    required: true,
    maxLength: 500,
    message: 'Comment must be less than 500 characters',
  },
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  static validateField(value: string, rules: any): ValidationResult {
    const errors: string[] = [];

    if (rules.required && (!value || value.trim().length === 0)) {
      errors.push(`This field is required`);
      return { isValid: false, errors };
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters`);
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Must be less than ${rules.maxLength} characters`);
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || 'Invalid format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateEmail(email: string): ValidationResult {
    return this.validateField(email, ValidationRules.email);
  }

  static validatePassword(password: string): ValidationResult {
    return this.validateField(password, ValidationRules.password);
  }

  static validateUsername(username: string): ValidationResult {
    return this.validateField(username, ValidationRules.username);
  }

  static validateForm(data: Record<string, string>, rules: Record<string, any>): ValidationResult {
    const allErrors: string[] = [];

    Object.keys(rules).forEach(field => {
      const fieldResult = this.validateField(data[field] || '', rules[field]);
      if (!fieldResult.isValid) {
        allErrors.push(...fieldResult.errors.map(error => `${field}: ${error}`));
      }
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}