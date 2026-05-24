import express from 'express';
import dotenv from 'dotenv';
import prisma from './config/prisma.js';
import { createClient } from 'redis';
import userRoutes from './routes/userRouter.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import cors from 'cors';

dotenv.config();
connectRabbitMQ();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables");
}
export const redisClient = createClient({
  url: redisUrl,
});
redisClient
  .connect()
  .then(() => console.log('Connected to Redis'))
  .catch((err) => console.error('Redis connection error:', err));

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


app.use('/api/user', userRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});