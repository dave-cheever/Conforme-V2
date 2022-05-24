import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

const usePrompt = (
  when: boolean,
  message: string,
) => {
  const history = useHistory();

  const self = useRef<any | null>();

  const onWindowOrTabClose = (event: BeforeUnloadEvent) => {
    if (!when) return;

    if (typeof event === 'undefined') event = window.event as BeforeUnloadEvent; // eslint-disable-line no-param-reassign

    if (event) event.returnValue = message; // eslint-disable-line no-param-reassign

    return message;
  };

  useEffect(() => {
    self.current = null;

    if (when) self.current = history.block(message);

    window.addEventListener('beforeunload', onWindowOrTabClose);

    return () => {
      if (self.current) {
        self.current();
        self.current = null;
      }

      window.removeEventListener('beforeunload', onWindowOrTabClose);
    };
  }, [message, when, onWindowOrTabClose]);
};

export default usePrompt;
