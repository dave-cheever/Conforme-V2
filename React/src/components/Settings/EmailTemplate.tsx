import React from 'react'
import { Image, Flex } from '@chakra-ui/react'

const EmailTemplate = () => {
    return (
      <Flex w="28%" flexDirection="column" mr={5} mt={5}>
        <Image w="full" h="180px" src="/thumbnail.png" cursor="pointer"/>
        <Flex fontSize="14px" color="#434B4F" mt={2}>Item status change</Flex>
      </Flex>
    )
}

export default EmailTemplate
