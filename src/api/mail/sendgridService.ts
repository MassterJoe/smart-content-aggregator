import SendGrid from "@sendgrid/mail";
import { Service } from "typedi";
import { env } from "../../env";
import { Logger } from "../../lib/logger";

@Service()
export class SendgridService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(SendgridService.name);

    if (!env.SENDGRID_API_KEY) {
      this.logger.error("❌ Missing SendGrid API key in environment variables");
    }

    SendGrid.setApiKey(env.SENDGRID_API_KEY);
  }

  async send(mail: SendGrid.MailDataRequired) {
    try {
      const transport = await SendGrid.send(mail);
      this.logger.info(`📧 E-Mail sent to ${mail.to}`);
      return transport;
    } catch (error: any) {
      this.logger.error(`❌ Failed to send email via SendGrid: ${error.message || error}`);
      throw error;
    }
  }
}
