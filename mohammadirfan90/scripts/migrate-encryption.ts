import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { encryptMessage } from '../lib/encryption';
import { Message } from '../models/Message';
import { connectDB } from '../lib/db';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function migrate() {
  console.log("Starting Message Encryption Migration...");
  
  try {
    await connectDB();
    Message.init();
    
    // Find all messages that do NOT have a ciphertext
    const unencryptedMessages = await Message.find({ ciphertext: { $exists: false } });
    console.log(`Found ${unencryptedMessages.length} unencrypted messages.`);
    
    if (unencryptedMessages.length === 0) {
      console.log("Migration complete: No legacy messages found.");
      process.exit(0);
    }
    
    let successCount = 0;
    
    for (const msg of unencryptedMessages) {
      if (msg.content && msg.content.trim().length > 0) {
        const encrypted = encryptMessage(msg.content);
        
        msg.ciphertext = encrypted.ciphertext;
        msg.iv = encrypted.iv;
        msg.authTag = encrypted.authTag;
        
        await msg.save();
        successCount++;
      }
    }
    
    console.log(`Migration successful: Encrypted ${successCount} messages.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
