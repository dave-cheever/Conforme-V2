import { IBaseModel, IComment, IOrganization } from 'app-interfaces';

export interface ICommentModel extends IBaseModel<IComment> {
  sendMentionedEmail: (userId: string, organization: IOrganization, comment: IComment) => Promise<void>
}
