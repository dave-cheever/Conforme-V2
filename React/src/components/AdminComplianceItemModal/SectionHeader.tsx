import { Text } from '@chakra-ui/react';

const SectionHeader = ({label, display="flex"}: {label: string, display?: string | string[]}) => {
  return (
    <Text fontSize="smm" fontWeight="bold" display={display}>{label}</Text>
  );
};

export default SectionHeader;
