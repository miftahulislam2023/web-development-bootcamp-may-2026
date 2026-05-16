const MIN_PASSWORD_LENGTH = 8
const PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[!@#$%^&*])/

/**
 * Validates password strength and confirms match.
 * Returns an error message or null if valid.
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required."
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return "Password must contain at least 1 number and 1 special character."
  }

  return null
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) {
    return "Passwords do not match."
  }

  return null
}
