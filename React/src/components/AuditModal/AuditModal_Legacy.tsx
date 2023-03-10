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
    (<AuditModalContext.Provider
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
      <Modal
        data-id="68d28b40ec07"
        isOpen={isOpen}
        onClose={onClose}
        variant="conformeModal">
        <ModalOverlay data-id="e755f7200e50" />
        <ModalContent
          borderRadius="20px"
          boxShadow="-10px 4px 30px 0px #00000026"
          data-id="30a311e0e1e0"
          h="calc(100vh - 30px)"
          m="15px 15px"
          maxW="800px">
          <ModalHeader data-id="44f2c59ebf6f" m="0px 5px 5px 5px">
            <Box data-id="4dae3d72178c">
              <Breadcrumb
                data-id="0557e2967c38"
                separator={<RightArrowIcon
                  boxSize={3}
                  data-id="ce414f513269"
                  transform="translate(0px, -2px)"
                  transformOrigin="center" />}
                spacing="8px">
                <BreadcrumbItem data-id="d9ab598ae6b3">
                  <Text
                    color="auditModal.title.text"
                    data-id="02b1212eb72a"
                    fontSize="lg"
                    fontWeight="700">
                    Audit
                  </Text>
                </BreadcrumbItem>
                <BreadcrumbItem data-id="52c1c0175a29">
                  <Text
                    color="auditModal.title.text"
                    data-id="dfdb1e9fd7a9"
                    fontSize="lg"
                    fontWeight="700"
                    m="0px 2px">
                    Office Hazard Assessment
                  </Text>
                </BreadcrumbItem>
              </Breadcrumb>
            </Box>
            <Box
              alignItems="center"
              data-id="519bab4489f7"
              display="flex"
              justifyContent="start">
              <Box
                alignItems="center"
                data-id="98e5c627f678"
                display="flex"
                height="40px"
                justifyContent="start"
                w="180px">
                <Avatar
                  bg="auditModal.avatar.bg"
                  data-id="8b3dadfd3e6a"
                  mr="10px"
                  name="Emma Head"
                  size="xs"
                  src="https://bit.ly/broken-link" />
                <Text
                  color="auditModal.avatar.text"
                  data-id="00adee064df7"
                  fontSize="md"
                  fontWeight="400">
                  Emma Head
                </Text>
              </Box>
              <Box
                alignItems="center"
                data-id="fe1c8da9aec3"
                display="flex"
                height="40px"
                justifyContent="start"
                w="230px">
                <LocationIcon boxSize={6} data-id="5e7e85b78ae1" mr="8px" />
                <Text
                  color="auditModal.location.text"
                  data-id="47cc1d574cfe"
                  fontSize="md"
                  fontWeight="400">
                  The Meriden Hospital
                </Text>
              </Box>
              <Box
                alignItems="center"
                data-id="57c2b7f1d821"
                display="flex"
                height="40px"
                justifyContent="start"
                w="180px">
                <AreaInfoIcon
                  boxSize={6}
                  data-id="6f380bfaea56"
                  transform="translate(0px, -2px)"
                  transformOrigin="center" />
                <SelectedArea data-id="13ee112219a1" />
              </Box>
            </Box>
          </ModalHeader>
          <ModalCloseButton boxSize={10} data-id="14c9a684330b" />
          <ModalBody
            data-id="db34a07391b1"
            maxH="calc(100vh - 204px)"
            overflow="hidden"
            p="10px 0px">
            <Box data-id="0a8c62bba2b4" display="flex" justifyContent="start" maxH="full">
              <Box data-id="5828f76abe48" w="200px">
                <AuditModalMenuItem
                  data-id="89473668596a"
                  icon={<AuditIcon data-id="bb3e6583313c" />}
                  label="Participants" />
                <AuditModalMenuItem
                  data-id="ecd8372d72bd"
                  icon={<QuestionsIcon data-id="9ea328347636" />}
                  label="Questions" />
                <AuditModalMenuItem
                  data-id="fa350c3e921b"
                  icon={<AssetsIcon data-id="011bb26fdcec" />}
                  label="Review" />
                <Box
                  alignItems="center"
                  data-id="7487651df2a9"
                  display="flex"
                  justifyContent="center"
                  mt="50px">
                  <CircularProgress data-id="002f957cdfc9" value={11} />
                </Box>
              </Box>
              <Box data-id="1d99f6b93830" p="5px 30px 5px 10px" w="600px">
                {participantsActive && <ParticipantsSection data-id="a860cacc59c6" />}
                {questionsActive && <QuestionsSection data-id="25b16b70600c" />}
                {reviewActive && <ReviewsSection data-id="eb5886cdaac8" />}
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter data-id="41bf9cbca9fc">
            <Button
              _hover={{ bg: 'auditModal.button.hoverBg' }}
              bg="auditModal.button.bg"
              data-id="acfcfe990a96"
              m="5px 0px"
              w="116px">
              <Text color="white" data-id="b658779ccb4b" fontSize="md" fontWeight="400">
                Start
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AuditModalContext.Provider>)
  );
};

export default AuditModalLegacy;
