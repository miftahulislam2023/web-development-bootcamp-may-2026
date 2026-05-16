import {
  loginUser as loginUserService,
  loginWithGoogle,
  registerUser as registerUserService
} from './auth.service.js';

async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password should be at least 6 characters' });
  }

  try {
    const auth = await registerUserService({ name, email, password });

    res.status(201).json({
      message: 'Account created',
      ...auth
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Could not register right now'
    });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const auth = await loginUserService({ email, password });

    res.json({
      message: 'Logged in',
      ...auth
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Could not login right now'
    });
  }
}

async function googleLogin(req, res) {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  try {
    const auth = await loginWithGoogle(credential);

    res.json({
      message: 'Logged in with Google',
      ...auth
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 400).json({
      message: error.statusCode ? error.message : 'Google login failed'
    });
  }
}

export {
  googleLogin,
  loginUser,
  registerUser
};
