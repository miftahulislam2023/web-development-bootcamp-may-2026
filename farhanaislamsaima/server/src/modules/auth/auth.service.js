import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../../shared/db.js';
import { signToken } from '../../shared/jwt.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function makePassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  return `${salt}:${hash}`;
}

function checkPassword(password, savedPassword) {
  const [salt, oldHash] = savedPassword.split(':');
  const newHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  return oldHash === newHash;
}

function cleanUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

async function registerUser({ name, email, password }) {
  const emailText = email.toLowerCase();
  const oldUser = await prisma.user.findUnique({
    where: { email: emailText }
  });

  if (oldUser) {
    const error = new Error('Email already exists');
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: emailText,
      password: makePassword(password)
    }
  });

  const clean = cleanUser(user);

  return {
    token: signToken(clean),
    user: clean
  };
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user || !user.password || !checkPassword(password, user.password)) {
    const error = new Error('Wrong email or password');
    error.statusCode = 400;
    throw error;
  }

  const clean = cleanUser(user);

  return {
    token: signToken(clean),
    user: clean
  };
}

async function loginWithGoogle(credential) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    const error = new Error('Google login is not configured');
    error.statusCode = 500;
    throw error;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const email = payload.email?.toLowerCase();

  if (!email || !payload.email_verified) {
    const error = new Error('Google email is not verified');
    error.statusCode = 400;
    throw error;
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: payload.name || email.split('@')[0],
        email,
        authProvider: 'google',
        googleId: payload.sub
      }
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        authProvider: user.authProvider || 'google',
        googleId: user.googleId || payload.sub
      }
    });
  }

  const clean = cleanUser(user);

  return {
    token: signToken(clean),
    user: clean
  };
}

export {
  loginUser,
  loginWithGoogle,
  registerUser
};
