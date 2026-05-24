import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL as string);

        const channel = await connection.createChannel();
        const queueName = 'send_otp';
        await channel.assertQueue(queueName, { durable: true });

        console.log("Mail Service consumer started, listening for otp emails...");

        channel.consume(queueName, async (msg) => {
            console.log("Received message from queue");
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());

                    const transporter = nodemailer.createTransport({
                        service: "gmail",

                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS,
                        },
                    });

                    await transporter.verify();

                    console.log("SMTP server is ready");

                    await transporter.sendMail({
                        from: `"Chat Application" <${process.env.EMAIL_USER}>`,
                        to,
                        subject,
                        text: body
                    });
                    console.log(`OTP email sent to ${to}`);
                    channel.ack(msg);
                } catch (error: any) {

                    console.error(
                        "Failed to send otp email:"
                    );

                    console.log(error);

                    if (msg) {
                        channel.nack(msg, false, false);
                    }
                }
            }
        });
    } catch (error) {
        console.error('Failed to start rabbitmq consumer:', error);
    }
}