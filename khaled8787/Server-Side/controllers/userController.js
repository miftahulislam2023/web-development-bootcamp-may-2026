import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, bio },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.userId, {
      password: hashed,
    });

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};