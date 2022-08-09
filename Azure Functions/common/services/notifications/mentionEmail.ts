const getMentionEmail = (template, { message, mentionedUser }) => {
  const replacedMentionedUsers = (message: string) => {
    return message.replace(/(@@@\([\w+( +\w+)*$]+\)\[[\w-]+\])/g, (matched) => {
      const userDisplayName = matched.split('@@@(')[1].split(')[')[0]
      return `<span style="display:inline-block;font-weight:bold;">${userDisplayName}</span>`
    })
  }

  template = template.split("%MentionedUser%").join(mentionedUser);
  template = template.split("%Message%").join(replacedMentionedUsers(message));

  return template;
};

export default getMentionEmail;