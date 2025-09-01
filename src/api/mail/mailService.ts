import { Logger } from "../../lib/logger";
import { SendgridService } from "./sendgridService";
import { Service } from "typedi";
import { env } from "../../env";

interface SendEmailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Service()
export class MailService {
  private readonly logger: Logger;

  constructor(private readonly sendgridService: SendgridService) {
    this.logger = new Logger(MailService.name);
  }

  async sendEmail({ to, subject, text, html }: SendEmailPayload) {
    if (!text && !html) {
      this.logger.error("❌ Cannot send email without text or html content");
      return;
    }

    const msg = {
      to,
      from: {
        email: env.MAIL_FROM,
        name: "AirtimeEx",
      },
      subject,
      content: [
        {
          type: html ? "text/html" : "text/plain",
          value: html || text || "",
        },
      ] as [ { type: "text/plain" | "text/html"; value: string } ],
    };

    try {
      await this.sendgridService.send(msg);
      this.logger.info(`📧 Email sent to ${to}`);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send email: ${error.message || error}`);
    }
  }
}
