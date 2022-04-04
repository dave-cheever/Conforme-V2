
export const getProtocol = () => {
  return process.env.ENV?.toLowerCase() === 'dev' ? 'http://' : 'https://';
};

export const genMetatags = (action: 'added' | 'updated' | 'removed', userId: string) => {
  return {
    [`${action}By`]: userId,
    [`${action}At`]: new Date(),
  };
};
