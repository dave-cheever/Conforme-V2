// import { Flex, Button } from '@chakra-ui/react';
// import React, { useState } from 'react'
// import { useSettingsContext } from '../../contexts/SettingsProvider';
// import { ISetting } from '../../interfaces/ISetting';
// import EmailEditor from './EmailEditor';

import { Flex } from "@chakra-ui/react"
import EmailTemplate from "./EmailTemplate"

const EmailTemplates = () => {
    // const { settings } = useSettingsContext();
    // const [selectedTemplate, setSelectedTemplate] = useState<ISetting>();
    // const [html, setHtml] = useState<string>();
    // const [loading, setLoading] = useState<string>();
    // const [editMode, setEditMode] = useState<boolean>(false);

    // const renderEmailEditor = () => (
    //     <Flex direction='column' w='full' h='full' overflow='hidden' px={3}>
    //       <Flex pb={3} color='theme.darkGrey' fontSize='16px'>Edit {selectedTemplate?.label} template</Flex>
    //       <EmailEditor setHtml={setHtml} value={selectedTemplate?.value} options={selectedTemplate?.options} />
    //       <Flex justify='center'>
    //         <Button
    //           w="110px"
    //           mt={3}
    //           bg="brand.addButton"
    //           color="white"
    //           fontSize="brand.primaryFont"
    //           fontWeight="700"
    //           _hover={{ bg: "#E6555C" }}
    //           onClick={() => {
    //             setEditMode(false);
    //             //html && generateThumbnail();
    //           }}
    //         >Update
    //         </Button>
    //       </Flex>
    //     </Flex>
    // );
    
    return (
        <Flex w="550px" h="full" flexWrap="wrap">
            <EmailTemplate/>
            <EmailTemplate/>
            <EmailTemplate/>
            <EmailTemplate/>
            <EmailTemplate/>
            <EmailTemplate/>
        </Flex>
    )
}

export default EmailTemplates
