import express from 'express';
import dotenv from 'dotenv';
import { startSendOtpConsumer } from './consumer.js';

dotenv.config();

startSendOtpConsumer();

const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'mail-service' });
});

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
