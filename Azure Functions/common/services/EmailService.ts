import IConfig from '../interfaces/IConfig';
import { GraphService } from './GraphService';
import { SendGridService } from './SendGridService';

export class EmailService {
  private _emailService: GraphService | SendGridService;

  public constructor(config: IConfig) {
    switch (config.EmailHandler) {
      case 'SendGrid':
        this._emailService = new SendGridService(config);
        break;
      default:
        this._emailService = new GraphService(config);
    }
  }

  public get sendEmail() {
    return this._emailService.sendEmail;
  }
};
