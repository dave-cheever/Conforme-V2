import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useInterval from 'react-useinterval';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from '@chakra-ui/react';
import { differenceInSeconds, parseISO } from 'date-fns';
import addHours from 'date-fns/addHours';
import { debounce } from 'lodash';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import useSession from '../hooks/useSession';

const timeBeforeSessionEnds = Number(process.env.REACT_APP_TIME_BEFORE_SESSION_ENDS || 60);
const events = ['mousemove', 'click', 'keypress'];
let idleEvent: NodeJS.Timeout;
let idleLogoutEvent: NodeJS.Timeout;

const IdleMonitor = () => {
  const toast = useToast();
  const history = useHistory();
  const { user, setUser } = useAppContext();
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

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      credentials: 'include',
      mode: 'no-cors',
    });

    // logOut user is expired after 24 hours
    const logOutUser = {
      displayName: user?.displayName,
      imgUrl: user?.imgUrl,
      firstName: user?.firstName,
      expiresAt: addHours(new Date(), 24),
    };
    await localStorage.setItem('logOutUser', JSON.stringify(logOutUser));
    setUser(null);
    history.push('/logout');
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
    <Modal isOpen={modalIsOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="lg" fontWeight="bold">
          Session timeout
        </ModalHeader>
        <ModalBody>
          <Text>
            Due to inactivity your session will expire in {secondsLeft < 1 ? 1 : secondsLeft} second
            {secondsLeft > 1 && 's'}.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" ml={3} onClick={logout}>
            Logout
          </Button>
          <Button ml={3} onClick={() => setModalIsOpen(false)}>
            Extend session
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IdleMonitor;
