import sgMail from '@sendgrid/mail';

import type IMail from './interfaces/mail.interface';

export class SendGridMail implements IMail {
  private readonly emailFrom = process.env.EMAIL_FROM as string;

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_KEY as string);
  }

  public async send(to: string, subject: string, body: string): Promise<void> {
    try {
      const msg = {
        to,
        from: this.emailFrom,
        subject,
        text: body
      };
      await sgMail.send(msg);
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        console.error((error as any).response.body);
      }
    }
  }
}
