import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function migrate() {
  console.log("Starting Message Encryption Cleanup...");
  
  try {
    const { connectDB } = await import('../lib/db');
    const { Message } = await import('../models/Message');
    
    await connectDB();
    Message.init();
    
    // Scrub the content field from all messages that have a ciphertext
    const result = await Message.updateMany(
      { ciphertext: { $exists: true } }, 
      { $unset: { content: 1 } }
    );
    
    console.log(`Cleanup complete. Modified ${result.modifiedCount} messages.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
