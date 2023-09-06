import { Text } from '@chakra-ui/react';

function SectionHeader({ label, display = 'flex' }: { label: string; display?: string | string[] }) {
  return <Text data-id="5852c4bc77bb" display={display} fontSize="smm" fontWeight="bold">
    {label}
  </Text>
}

export default SectionHeader;
