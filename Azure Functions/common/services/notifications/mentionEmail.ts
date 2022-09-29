const getMentionEmail = (template, { message, mentionedUser }) => {
  const replacedMentionedUsers = (message: string) => {
    return message.replace(/(@\[[a-zA-Z0-9 .,\-'()[\]{}]*\]\([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\))/g, (matched) => {
      const userDisplayName = matched.split('@[')[1]?.split('](')[0]
      return `<span style="display:inline-block;font-weight:bold;">${userDisplayName}</span>`
    })
  }

  template = template.split("%MentionedUser%").join(mentionedUser);
  template = template.split("%Message%").join(replacedMentionedUsers(message));

  return template;
};

export default getMentionEmail;