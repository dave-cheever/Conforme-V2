import { Button, useDisclosure } from "@chakra-ui/react";
import AuditModal from "../components/AuditModal/AuditModal";

const Home = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        onClick={() => onOpen()}
        color="white"
        bg="homePage.button.bg"
        _hover={{ bg: "homePage.button.hoverBg" }}
        m={4}
      >Open Audit Modal</Button>
      <AuditModal onClose={onClose} isOpen={isOpen} />
    </>
  );
};

export default Home;
