import bcrypt from "bcryptjs";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import UserModel from "./models/userModel.js";

// Generate profilePic using first letter of fullName
const generateProfilePic = (fullName) => {
  const firstLetter = fullName.charAt(0).toUpperCase();
  return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff`;
};

// Demo user data (10 entries)
const demoUsers = [
  { fullName: "Rahat Karim", email: "rahat@example.com" },
  { fullName: "Sumona Akter", email: "sumona@example.com" },
  { fullName: "Mahfuz Rahman", email: "mahfuz@example.com" },
  { fullName: "Selina Hossain", email: "selina@example.com" },
  { fullName: "Humayun Ahmed", email: "humayun@example.com" },
  { fullName: "Jasim Uddin", email: "jasim@example.com" },
  { fullName: "Tahmina Sultana", email: "tahmina@example.com" },
  { fullName: "Kazi Nazrul", email: "nazrul@example.com" },
  { fullName: "Sabina Yasmin", email: "sabina@example.com" },
];

const seedUsers = async () => {
  try {
    await connectDB();

    const hashedUsers = await Promise.all(
      demoUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash("123456789", 10), // same demo password
        profilePic: generateProfilePic(user.fullName),
        bio: "This is a demo user profile.",
      }))
    );

    await UserModel.insertMany(hashedUsers);
    console.log("✅ 10 Demo users seeded successfully.");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();
