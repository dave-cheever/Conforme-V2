import { Button, Flex, Stack } from '@chakra-ui/react';

import RenewalModal from '../../components/Response/RenewalModal';
import ResponseTabItem from '../../components/Response/ResponseTabItem';
import { useResponseContext } from '../../contexts/ResponseProvider';
import useResponseUtils from '../../hooks/useResponseUtils';

const ComplianceItemResponse = () => {
  const { response, activeTab, setActiveTab: updateActiveTab, isQuestionFormDirty, setIsQuestionFormDirty } = useResponseContext();
  const { getResponseTabItems } = useResponseUtils();
  const responseTabItems = getResponseTabItems(response);
  const activeTabItem = responseTabItems[activeTab];
  // const [run, setRun] = useState(false);
  // const device = useDevice();

  // useEffect(() => {
  //   if (getStatus(response) === 'compliant' && !snapshot) setRun(false); // TODO: needs to be updated, fix dimensions and trigger
  // }, [response]);

  const setActiveTab = (activeTab: number) => {
    if (isQuestionFormDirty) {
      // eslint-disable-next-line no-alert
      const confirm = window.confirm(
        'You have unsaved changes, you will lose all of your changes. Are you sure you want to navigate away?',
      );
      if (!confirm) return;
      setIsQuestionFormDirty(false);
    }
    updateActiveTab(activeTab);
  };

  // TODO: Fix confetti
  // const confettiHeight = useMemo(() => {
  //   if (device === 'desktop') return window.innerHeight - 100;
  //   if (device === 'tablet') return window.innerHeight - 100;
  //   return window.innerHeight - 200;
  // }, [device, window]);

  // const confettiWidth = useMemo(() => {
  //   if (device === 'desktop') return window.innerWidth - 300;
  //   if (device === 'tablet') return window.innerWidth - 200;
  //   return window.innerWidth - 80;
  // }, [device, window]);

  return (
    <>
      <RenewalModal />
      {/* <Confetti height={confettiHeight} recycle={false} run={run} width={confettiWidth} /> */}
      <Flex direction="column" h="full" w="full">
        <Flex
          bg="complianceItemResponse.bg"
          borderRadius="20px"
          flexDir="column"
          h={['fit-content', 'full']}
          p={['15px 20px 20px 20px', '25px 30px 25px 30px']}
          w="full"
        >
          <Flex align="center" justify="space-between" mb={[4, 8]}>
            <Stack direction="row" justify={['center', 'flex-start']} spacing={2} w="full">
              {responseTabItems.map(({ index, label, icon }) => (
                <ResponseTabItem
                  active={activeTab === index}
                  icon={icon}
                  index={index}
                  key={label}
                  label={label}
                  setActiveTab={setActiveTab}
                />
              ))}
            </Stack>
            <Stack direction="row" display={['none', 'flex']} spacing={2}>
              {activeTab > 0 && (
                <Button
                  borderRadius="10px"
                  color="complianceItemResponse.nextButtonColor"
                  flexShrink={0}
                  fontSize="11px"
                  fontWeight="bold"
                  h="28px"
                  onClick={() => setActiveTab(activeTab - 1)}
                  w="120px"
                >
                  Previous step
                </Button>
              )}
              {activeTab < responseTabItems.length - 1 && (
                <Button
                  borderRadius="10px"
                  color="complianceItemResponse.nextButtonColor"
                  display={['none', 'block']}
                  flexShrink={0}
                  fontSize="11px"
                  fontWeight="bold"
                  h="28px"
                  onClick={() => setActiveTab(activeTab + 1)}
                  w="120px"
                >
                  Next step
                </Button>
              )}
            </Stack>
          </Flex>
          <activeTabItem.component />
        </Flex>
      </Flex>
    </>
  );
};

export default ComplianceItemResponse;

export const complianceItemResponseStyles = {
  complianceItemResponse: {
    bg: 'white',
    nextButtonColor: '#818197',
    labelColor: '#818197',
    expandButtonText: '#462AC4',
    labelTextColor: '#1F1F1F',
    textColor: '#282F36',
  },
};
