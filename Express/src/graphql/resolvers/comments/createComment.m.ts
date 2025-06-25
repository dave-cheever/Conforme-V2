import { IAudit, IResponse } from 'app-interfaces';
import { Audits, Comments, Responses } from 'app-models';
import { isPermitted, mentionParser } from 'app-utils';

const createComment = async (_, { commentInput }, { authorize, organization }) => {
  try {
    const user = await authorize();
    let componentData: IResponse | IAudit = {} as IResponse | IAudit;

    if (commentInput.scope.type === 'tracker') componentData = await Responses.customFindById(commentInput.componentId, organization._id);
    if (commentInput.scope.type === 'audits') componentData = await Audits.customFindById(commentInput.componentId, organization._id);

    if (
      !isPermitted({
        user,
        action: commentInput.scope.type === 'tracker' ? 'comments.add' : 'auditComments.add',
        data: {
          ...(commentInput.scope.type === 'tracker' ? { response: componentData } : { audit: componentData }),
        },
      })
    )
      throw new Error('User is not permitted');

    const newComment = {
      ...commentInput,
      authorId: user.userId,
    };
    const createdCommment = await Comments.customCreate(newComment, user.userId, organization._id);

    // handle mentioning on chat
    const mentionedUserIds = mentionParser(newComment.text);

    if (mentionedUserIds?.length > 0) {
      await Promise.all(
        mentionedUserIds.map((mentionedUserId) => Comments.sendMentionedEmail(mentionedUserId, organization, createdCommment)),
      );
    }

    return createdCommment;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createComment;
