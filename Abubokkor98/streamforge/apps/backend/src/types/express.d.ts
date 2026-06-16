export interface AuthenticatedUser {
  userId: number;
  email: string;
}

// Extend Express Request globally to carry authenticated user data
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
