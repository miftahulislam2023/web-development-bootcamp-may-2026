import amqp from 'amqplib';
import dotenv from 'dotenv';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    dotenv.config();
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
        channel = await connection.createChannel();
        console.log(' Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
}


export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        console.error('RabbitMQ channel is not initialized');
        return;
    }

    try {
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`Message published to queue ${queueName}`);
    } catch (error) {
        console.error('Failed to publish message to queue:', error);
    }
}