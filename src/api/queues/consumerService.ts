import { RabbitMQService } from "./rabbitmqService";
import { Logger } from "../../lib/logger";
import { Service } from "typedi";

@Service()
export class ConsumerService {
  private readonly logger: Logger;

  constructor(private readonly rabbitmqService: RabbitMQService) {
    this.logger = new Logger(ConsumerService.name);
  }

  async startConsumer() {
    try {
      await this.rabbitmqService.consumeRabbitMQMessages(
        "registration",
        async (msg: Record<string, any>) => {
          const { email, name } = msg;

          // Extra context for logs
          this.logger.info(
            `📩 Registration event consumed → Email: ${email}${name ? ` | Name: ${name}` : ""}`
          );
        }
      );

      this.logger.info("✅ Consumer started successfully for queue: registration");
    } catch (error: any) {
      this.logger.error(`❌ Failed to start consumer: ${error.message || error}`);
      throw error;
    }
  }
}

