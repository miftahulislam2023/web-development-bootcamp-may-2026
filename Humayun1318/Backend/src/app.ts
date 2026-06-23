import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { router } from './app/routes';
import { envVars } from './app/config/env';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

// Import and initialize Passport authentication strategies (Google OAuth, Local)
import './app/config/passport';
import passport from 'passport';

const app = express();

/**
 * Configure Express Session Middleware
 * Purpose: Enable server-side session management for storing user authentication state
 */
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

/**
 * Enable Passport Session Support
 * Serializes/deserializes user data to/from sessions
 */
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  }),
);

// apps entry point
app.use('/api/v1', router);

// Basic route for testing
// app.get('/', (_req, res) => {
//   res.send('Hello, World!');
// });

app.use(globalErrorHandler);
app.use(notFound);

export default app;
