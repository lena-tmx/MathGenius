export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "Email is required";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters";
  }

  return null;
}

export function validateStudyPlan(input: {
  goal: string;
  gradeBand: string;
  intensity: string;
  topicSlugs: string[];
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.goal.trim()) {
    errors.goal = "Goal is required";
  }

  if (!input.gradeBand.trim()) {
    errors.gradeBand = "Grade band is required";
  }

  if (!input.intensity.trim()) {
    errors.intensity = "Intensity is required";
  }

  if (input.topicSlugs.length === 0) {
    errors.topicSlugs = "Select at least one topic";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
