import * as amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const startSendOtpConsumer = async() => {
    let retries = 10;
    while (retries > 0) {
        try {
            const connection = await amqp.connect({
                protocol: 'amqp',
                hostname: process.env.RABBITMQ_HOST!,
                port: 5672,
                username: process.env.RABBITMQ_USERNAME!,
                password: process.env.RABBITMQ_PASSWORD!
            });

            const channel = await connection.createChannel();
            
            const queueName = "send-otp";

            await channel.assertQueue(queueName, {durable: true});

            console.log("Mail service consumer started, listening for otp emails");

            channel.consume(queueName, async (msg) => {
                if(msg){
                    try {

                        const {to, subject, body} = JSON.parse(msg.content.toString())

                        const transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: 587,
                            secure: false,
                            family: 4,
                            auth: {
                                user: process.env.MAIL_USER,
                                pass: process.env.MAIL_PASSWORD,
                            },
                        } as any);


                        await transporter.sendMail({
                            from: "Alapon",
                            to,
                            subject,
                            html: body,
                        })

                        console.log(`OTP mail sent to ${to}`);
                        channel.ack(msg);

                    
                    } catch (error) {
                        console.log("Failed to send OTP", error);
                        
                    }
                }
            });

            return; // success
        } catch (error) {
            console.log(`Failed to start RabbitMQ consumer, retries left: ${retries}`, error);
            retries--;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    console.log("Failed to connect to RabbitMQ after all retries");
}