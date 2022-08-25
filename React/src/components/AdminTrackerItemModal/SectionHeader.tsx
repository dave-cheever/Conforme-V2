import { Text } from '@chakra-ui/react';

const SectionHeader = ({ label, display = 'flex' }: { label: string; display?: string | string[] }) => (
  <Text display={display} fontSize="smm" fontWeight="bold">
    {label}
  </Text>
);

export default SectionHeader;
