import { rabbitMQChannel, MAX_UNPROCESSED_QUEUE } from "../../config/rabbitmq";
import { MailService } from "../mail/mailService";
import { Logger } from "../../lib/logger";
import { Service } from "typedi";

@Service()
export class RabbitMQService {
  private readonly logger: Logger;

  constructor(private readonly mailservice: MailService) {
    this.logger = new Logger(RabbitMQService.name);
  }

  async sendRabbitMQMessage(queueName: string, messageBody: any) {
    try {
      const channel = await rabbitMQChannel();
      if (!channel) {
        this.logger.error("❌ Failed to create RabbitMQ channel");
        return;
      }

      const availableQueues = await channel.assertQueue(queueName, { durable: true });

      if (availableQueues.messageCount > MAX_UNPROCESSED_QUEUE) {
        this.logger.warn(
          `⚠️ Queue "${queueName}" has ${availableQueues.messageCount} messages, above limit ${MAX_UNPROCESSED_QUEUE}`
        );
        return;
      }

      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messageBody)), {
        persistent: true,
      });

      this.logger.info(`📤 Message sent to queue "${queueName}"`);
    } catch (err: any) {
      this.logger.error(`❌ Error sending message to queue "${queueName}": ${err.message || err}`);
    }
  }

  async consumeRabbitMQMessages(
    queueName: string,
    callback?: (msg: Record<string, any>) => Promise<void>
  ) {
    try {
      const channel = await rabbitMQChannel();
      if (!channel) {
        this.logger.error("❌ Failed to create RabbitMQ channel");
        return;
      }

      await channel.assertQueue(queueName, { durable: true });
      channel.prefetch(MAX_UNPROCESSED_QUEUE);

      this.logger.info(`✅ Waiting for messages in queue: "${queueName}"`);

      channel.consume(queueName, async (msg: any) => {
        if (!msg) return;

        try {
          const payload = JSON.parse(msg.content.toString()) as {
            name: string;
            otp: string;
            email: string;
            subject?: string;
            verification_link: string;
            email_category?: string;
          };

          const { name, otp, email, subject, verification_link, email_category } = payload;

          // Send email
          await this.mailservice.sendEmail({
            to: email,
            subject: subject || "Account Activation",
            text: `Hello ${name},\n\nWelcome to AirtimeEx! Your OTP is ${otp}. Please verify your email using the link: ${verification_link}`,
            html: `<h1>Hello ${name},</h1>
                   <p>Welcome to the AirtimeEx! Your OTP is <strong>${otp}</strong>.</p>
                   <p>Please verify your email using the link: <a href="${verification_link}">Verify Email</a></p>`,
          });

          // Optional callback
          if (callback) {
            await callback(payload);
          }

          channel.ack(msg);
          this.logger.info(`✅ Message for ${email} processed and acknowledged`);
        } catch (error: any) {
          this.logger.error(`❌ Error processing message: ${error.message || error}`);
          channel.nack(msg, false, true); // requeue for retry
        }
      });
    } catch (error: any) {
      this.logger.error(`❌ Error consuming messages from "${queueName}": ${error.message || error}`);
      throw error;
    }
  }
}