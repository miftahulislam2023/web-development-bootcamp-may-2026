import { saveNotificationToken } from './notifications.service.js';

async function registerNotificationToken(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Notification token is required' });
  }

  try {
    await saveNotificationToken({
      token,
      userId: req.user.id
    });

    console.log(`Notification token registered for user ${req.user.id}`);
    res.status(201).json({ message: 'Notification token registered' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Could not register notification token' });
  }
}

export {
  registerNotificationToken
};
