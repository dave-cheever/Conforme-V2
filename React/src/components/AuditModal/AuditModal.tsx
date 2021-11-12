import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
  Avatar,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  AreaInfoIcon,
  AssetsIcon,
  AuditIcon,
  LocationIcon,
  QuestionsIcon,
  RightArrowIcon,
} from "../../icons";
import { IAuditModal } from "../../interfaces/IAuditModal";
import SelectedArea from "./SelectedArea";
import CircularProgress from "../CircularProgress";
import AuditModalContext from "./AuditModalContext";
import AuditModalMenuItem from "./AuditModalMenuItem";
import ParticipantsSection from "./ParticipantsSection";
import QuestionsSection from "./QuestionsSection";
import ReviewsSection from "./ReviewsSection";
import { IAuditor } from "../../interfaces/IAuditor";

let dummyAuditors = [
  {
    name: "Ali Sanaei ",
    designation: "CEO",
    imgSrc: ""
  },
  {
    name: "Emma Head",
    designation: "Corporate Lead",
    imgSrc: ""
  },
  {
    name: "Zunaib Imtiaz",
    designation: "Trail Developer",
    imgSrc: ""
  },
];

const AuditModal = ({ onClose, isOpen }: IAuditModal) => {


  const [auditorSearchText, setAuditorSearchText] = useState("");
  const [auditors, setAuditors] = useState<IAuditor[]>([])
  const [selectedAuditors, setSelectedAuditors] = useState<IAuditor[]>([])
  const [selectedArea, setSelectedArea] = useState("Surgery");
  const [activePage, setActivePage] = useState("Participants");

  useEffect(() => {
    //Replace with API
    setAuditors(dummyAuditors)
  }, [])

  useEffect(() => {
    let updatedAuditorsAfterSearch = dummyAuditors.filter(val =>
      !selectedAuditors.includes(val));
    setAuditors(updatedAuditorsAfterSearch);
  }, [selectedAuditors]);

  const updateAuditorSearchText = (searchedName: string) => {
    searchedName.toLowerCase();
    setAuditorSearchText(searchedName);
    if (searchedName.length > 0) {
      let temp = dummyAuditors.filter(({ name }: IAuditor) =>
        name.toLowerCase().includes(searchedName))
      setAuditors(temp);
    }
  }

  const updateSelectedAuditors = (auditor: IAuditor, action: string) => {
    if (action === "add") {
      const currentAuditors =
        auditors.filter((currAuditor: IAuditor) =>
          currAuditor.name !== auditor.name);
      setAuditors(currentAuditors)
      setSelectedAuditors([...selectedAuditors, auditor])
    } else if (action === "remove") {
      const currentSelectedAuditors =
        selectedAuditors.filter((currAuditor: IAuditor) =>
          currAuditor.name !== auditor.name);
      setSelectedAuditors(currentSelectedAuditors)
      setAuditors([...auditors, auditor])
    }
  }


  const participantsActive = useMemo(() => activePage === "Participants", [activePage]);
  const questionsActive = useMemo(() => activePage === "Questions", [activePage]);
  const reviewActive = useMemo(() => activePage === "Review", [activePage]);

  return (
    <AuditModalContext.Provider
      value={{
        activePage, setActivePage,
        selectedArea, setSelectedArea,
        auditors, selectedAuditors, updateSelectedAuditors,
        auditorSearchText, updateAuditorSearchText
      }}
    >
      <Modal variant="conformeModal" onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent
          m="15px 15px"
          h="calc(100vh - 30px)"
          maxW="800px"
          boxShadow="-10px 4px 30px 0px #00000026"
          borderRadius="20px"
        >
          <ModalHeader m="0px 5px 5px 5px">
            <Box>
              <Breadcrumb
                spacing="8px"
                separator={
                  <RightArrowIcon
                    transformOrigin="center"
                    transform="translate(0px, -2px)"
                    boxSize={3}
                  />
                }
              >
                <BreadcrumbItem>
                  <Text
                    fontSize="lg"
                    fontWeight="700"
                    color="auditModal.title.text"
                  >
                    Audit
                  </Text>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Text
                    fontSize="lg"
                    fontWeight="700"
                    color="auditModal.title.text"
                    m="0px 2px"
                  >
                    Office Hazard Assessment
                  </Text>
                </BreadcrumbItem>
              </Breadcrumb>
            </Box>
            <Box display="flex" justifyContent="start" alignItems="center">
              <Box display="flex" justifyContent="start"
                alignItems="center" height="40px" w="180px" >
                <Avatar size="xs" bg="auditModal.avatar.bg" name="Emma Head"
                  src="https://bit.ly/broken-link" mr="10px" />
                <Text fontWeight="400" fontSize="md" color="auditModal.avatar.text" >Emma Head</Text>
              </Box>
              <Box display="flex" justifyContent="start"
                alignItems="center" height="40px" w="230px">
                <LocationIcon mr="8px" boxSize={6} />
                <Text
                  fontWeight="400"
                  fontSize="md"
                  color="auditModal.location.text"
                >
                  The Meriden Hospital
                </Text>
              </Box>
              <Box display="flex" justifyContent="start"
                alignItems="center" height="40px" w="180px" >
                <AreaInfoIcon boxSize={6} transformOrigin="center" transform="translate(0px, -2px)" />
                <SelectedArea />
              </Box>
            </Box>
          </ModalHeader>
          <ModalCloseButton boxSize={10} />
          <ModalBody p="10px 0px" maxH="calc(100vh - 204px)" overflow="hidden">
            <Box display="flex" justifyContent="start" maxH="full">
              <Box w="200px">
                <AuditModalMenuItem label="Participants" icon={<AuditIcon />} />
                <AuditModalMenuItem
                  label="Questions"
                  icon={<QuestionsIcon />} />
                <AuditModalMenuItem
                  label="Review"
                  icon={<AssetsIcon />} />
                <Box display="flex" justifyContent="center"
                  alignItems="center" mt="50px">
                  <CircularProgress value={11} />
                </Box>
              </Box>
              <Box w="600px" p="5px 30px 5px 10px">
                {participantsActive && <ParticipantsSection />}
                {questionsActive && <QuestionsSection />}
                {reviewActive && <ReviewsSection />}
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              w="116px"
              m="5px 0px"
              bg="auditModal.button.bg"
              _hover={{ bg: "auditModal.button.hoverBg" }}
            >
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

export default AuditModal;
