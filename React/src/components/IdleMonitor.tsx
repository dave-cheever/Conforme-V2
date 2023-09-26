import { useEffect, useState } from 'react';
import useInterval from 'react-useinterval';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from '@chakra-ui/react';
import { differenceInSeconds, parseISO } from 'date-fns';
import { debounce } from 'lodash';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useLogout from '../hooks/useLogout';
import useSession from '../hooks/useSession';

const timeBeforeSessionEnds = Number(process.env.REACT_APP_TIME_BEFORE_SESSION_ENDS || 60);
const events = ['mousemove', 'click', 'keypress'];
let idleEvent: NodeJS.Timeout;
let idleLogoutEvent: NodeJS.Timeout;

function IdleMonitor() {
  const toast = useToast();
  const logout = useLogout();
  const { setUser } = useAppContext();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(timeBeforeSessionEnds);
  const refetch = useSession();
  useInterval(() => setSecondsLeft(secondsLeft - 1), secondsLeft ? 1000 : null);

  const checkUser = debounce(
    async () => {
      try {
        const { error, data } = await refetch();
        if (error || !data) throw new Error();

        const secondsToExpiration = differenceInSeconds(parseISO(data.session.sessionExpiration), new Date()) - 5;
        return [secondsToExpiration - timeBeforeSessionEnds, secondsToExpiration];
      } catch (e) {
        toast({
          ...toastFailed,
          title: 'Signed out',
          description: 'You have been signed out due to inactivity. Please login again.',
        });
        setUser(undefined);
        return [];
      }
    },
    timeBeforeSessionEnds * 100,
    {
      leading: true,
      trailing: false,
      maxWait: timeBeforeSessionEnds * 100,
    },
  );

  const showModal = () => {
    if (!modalIsOpen) {
      setSecondsLeft(timeBeforeSessionEnds);
      setModalIsOpen(true);
    }
  };

  const setTimers = async () => {
    if (!modalIsOpen) {
      const times = await checkUser();
      if (times) {
        const [timeToShowModal, timeToLogout] = times;
        if (idleEvent) clearTimeout(idleEvent);

        idleEvent = setTimeout(showModal, timeToShowModal * 1000);

        if (idleLogoutEvent) clearTimeout(idleLogoutEvent);

        idleLogoutEvent = setTimeout(async () => {
          await logout();
        }, timeToLogout * 1000);
      }
    }
  };

  useEffect(() => {
    setTimers();
    for (const e in events) if (e) window.addEventListener(events[e], setTimers);

    return () => {
      for (const e in events) if (e) window.removeEventListener(events[e], setTimers);
    };
  }, [modalIsOpen]);

  return (
    (<Modal data-id="f0b0579fe21d" isOpen={modalIsOpen} onClose={() => { }}>
      <ModalOverlay data-id="fe54873c4303" />
      <ModalContent data-id="03d2d7be8a84">
        <ModalHeader data-id="682364375995" fontSize="lg" fontWeight="bold">
          Session timeout
        </ModalHeader>
        <ModalBody data-id="ab3434d8690b">
          <Text data-id="fcb4f18ee6ac">
            Due to inactivity your session will expire in {secondsLeft < 1 ? 1 : secondsLeft} second
            {secondsLeft > 1 && 's'}.
          </Text>
        </ModalBody>
        <ModalFooter data-id="7ea1f1eac8e2">
          <Button colorScheme="red" data-id="dda44b9550c5" ml={3} onClick={logout}>
            Logout
          </Button>
          <Button data-id="5b4be66a9ae6" ml={3} onClick={() => setModalIsOpen(false)}>
            Extend session
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>)
  );
}

export default IdleMonitor;
