import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await mongoose.connection.db.collection('transactions').deleteMany({});
  console.log("Deleted transactions");
  process.exit(0);
});
