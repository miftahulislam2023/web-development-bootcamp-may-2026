'use server';

import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(data) {
  try {
    const validatedData = registerSchema.parse(data);

    await connectToDatabase();

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return { error: 'An account with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = new User({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    });

    await newUser.save();

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Registration Error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}
