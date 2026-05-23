import * as amqp from 'amqplib';


let connection: any;
let channel: any;

export const connectRabbitMQ = async() => {
    let retries = 10;
    while (retries > 0) {
        try {
            connection = await amqp.connect({
                protocol: 'amqp',
                hostname: process.env.RABBITMQ_HOST!,
                port: 5672,
                username: process.env.RABBITMQ_USERNAME!,
                password: process.env.RABBITMQ_PASSWORD!
            });

            channel = await connection.createChannel();

            console.log("Connected to RabbitMQ");
            return;
        } catch (error) {
            console.log(`Failed to connect RabbitMQ, retries left: ${retries}`, error);
            retries--;
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
        }
    }
    console.log("Failed to connect to RabbitMQ after all retries");
};


export const publishToQueue = async(queueName: string, message: any) => {
    if(!channel){
        console.log("RabbitMQ is not initialized");
        return;
    }

    await channel.assertQueue(queueName, {durable: true});

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
}