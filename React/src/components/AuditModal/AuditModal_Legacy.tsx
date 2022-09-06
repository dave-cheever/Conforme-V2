import { useEffect, useMemo, useState } from 'react';

import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import { AreaInfoIcon, AssetsIcon, AuditIcon, LocationIcon, QuestionsIcon, RightArrowIcon } from '../../icons';
import { IAuditModal } from '../../interfaces/IAuditModal';
import { IAuditor } from '../../interfaces/IAuditor';
import CircularProgress from '../CircularProgress';
import AuditModalContext from './AuditModalContext';
import AuditModalMenuItem from './AuditModalMenuItem';
import ParticipantsSection from './ParticipantsSection';
import QuestionsSection from './QuestionsSection';
import ReviewsSection from './ReviewsSection';
import SelectedArea from './SelectedArea';

const dummyAuditors = [
  {
    name: 'Ali Sanaei ',
    designation: 'CEO',
    imgSrc: '',
  },
  {
    name: 'Emma Head',
    designation: 'Corporate Lead',
    imgSrc: '',
  },
  {
    name: 'Zunaib Imtiaz',
    designation: 'Trail Developer',
    imgSrc: '',
  },
];

const AuditModalLegacy = ({ onClose, isOpen }: IAuditModal) => {
  const [auditorSearchText, setAuditorSearchText] = useState('');
  const [auditors, setAuditors] = useState<IAuditor[]>([]);
  const [selectedAuditors, setSelectedAuditors] = useState<IAuditor[]>([]);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('Surgery');
  const [activePage, setActivePage] = useState('Participants');

  useEffect(() => {
    // Replace with API
    setAuditors(dummyAuditors);
  }, []);

  useEffect(() => {
    const updatedAuditorsAfterSearch = dummyAuditors.filter((val) => !selectedAuditors.includes(val));
    setAuditors(updatedAuditorsAfterSearch);
  }, [selectedAuditors]);

  const updateAuditorSearchText = (searchedName: string) => {
    searchedName.toLowerCase();
    setAuditorSearchText(searchedName);
    if (searchedName.length > 0) {
      const temp = dummyAuditors.filter(({ name }: IAuditor) => name.toLowerCase().includes(searchedName));
      setAuditors(temp);
    }
  };

  const updateSelectedAuditors = (auditor: IAuditor, action: string) => {
    if (action === 'add') {
      const currentAuditors = auditors.filter((currAuditor: IAuditor) => currAuditor.name !== auditor.name);
      setAuditors(currentAuditors);
      setSelectedAuditors([...selectedAuditors, auditor]);
    } else if (action === 'remove') {
      const currentSelectedAuditors = selectedAuditors.filter((currAuditor: IAuditor) => currAuditor.name !== auditor.name);
      setSelectedAuditors(currentSelectedAuditors);
      setAuditors([...auditors, auditor]);
    }
  };

  const participantsActive = useMemo(() => activePage === 'Participants', [activePage]);
  const questionsActive = useMemo(() => activePage === 'Questions', [activePage]);
  const reviewActive = useMemo(() => activePage === 'Review', [activePage]);

  return (
    <AuditModalContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedBusinessUnit,
        setSelectedBusinessUnit,
        auditors,
        selectedAuditors,
        updateSelectedAuditors,
        auditorSearchText,
        updateAuditorSearchText,
      }}
    >
      <Modal isOpen={isOpen} onClose={onClose} variant="conformeModal">
        <ModalOverlay />
        <ModalContent borderRadius="20px" boxShadow="-10px 4px 30px 0px #00000026" h="calc(100vh - 30px)" m="15px 15px" maxW="800px">
          <ModalHeader m="0px 5px 5px 5px">
            <Box>
              <Breadcrumb
                separator={<RightArrowIcon boxSize={3} transform="translate(0px, -2px)" transformOrigin="center" />}
                spacing="8px"
              >
                <BreadcrumbItem>
                  <Text color="auditModal.title.text" fontSize="lg" fontWeight="700">
                    Audit
                  </Text>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Text color="auditModal.title.text" fontSize="lg" fontWeight="700" m="0px 2px">
                    Office Hazard Assessment
                  </Text>
                </BreadcrumbItem>
              </Breadcrumb>
            </Box>
            <Box alignItems="center" display="flex" justifyContent="start">
              <Box alignItems="center" display="flex" height="40px" justifyContent="start" w="180px">
                <Avatar bg="auditModal.avatar.bg" mr="10px" name="Emma Head" size="xs" src="https://bit.ly/broken-link" />
                <Text color="auditModal.avatar.text" fontSize="md" fontWeight="400">
                  Emma Head
                </Text>
              </Box>
              <Box alignItems="center" display="flex" height="40px" justifyContent="start" w="230px">
                <LocationIcon boxSize={6} mr="8px" />
                <Text color="auditModal.location.text" fontSize="md" fontWeight="400">
                  The Meriden Hospital
                </Text>
              </Box>
              <Box alignItems="center" display="flex" height="40px" justifyContent="start" w="180px">
                <AreaInfoIcon boxSize={6} transform="translate(0px, -2px)" transformOrigin="center" />
                <SelectedArea />
              </Box>
            </Box>
          </ModalHeader>
          <ModalCloseButton boxSize={10} />
          <ModalBody maxH="calc(100vh - 204px)" overflow="hidden" p="10px 0px">
            <Box display="flex" justifyContent="start" maxH="full">
              <Box w="200px">
                <AuditModalMenuItem icon={<AuditIcon />} label="Participants" />
                <AuditModalMenuItem icon={<QuestionsIcon />} label="Questions" />
                <AuditModalMenuItem icon={<AssetsIcon />} label="Review" />
                <Box alignItems="center" display="flex" justifyContent="center" mt="50px">
                  <CircularProgress value={11} />
                </Box>
              </Box>
              <Box p="5px 30px 5px 10px" w="600px">
                {participantsActive && <ParticipantsSection />}
                {questionsActive && <QuestionsSection />}
                {reviewActive && <ReviewsSection />}
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button _hover={{ bg: 'auditModal.button.hoverBg' }} bg="auditModal.button.bg" m="5px 0px" w="116px">
              <Text color="white" fontSize="md" fontWeight="400">
                Start
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AuditModalContext.Provider>
  );
};

export default AuditModalLegacy;
