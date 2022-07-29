import React, { useRef } from 'react';

import { Box, Button, Stack } from '@chakra-ui/react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const sunEditorOptions = {
  buttonList: [
    ['formatBlock'],
    ['fontSize', 'align'],
    ['bold', 'underline', 'italic', 'strike', 'hiliteColor'],
    ['list', 'outdent', 'indent'],
    ['link', 'table', 'removeFormat'],
  ],
  height: 'calc(100vh - 250px)',
  toolbarContainer: '#custom_toolbar',
};

const EmailEditor = ({ setHtml, value, options }) => {
  const editorRef = useRef();

  const getSunEditorInstance = (sunEditor) => {
    editorRef.current = sunEditor;
  };

  const insertTag = (tag: string) => {
    if (editorRef && editorRef.current) {
      // @ts-expect-error
      editorRef.current.insertHTML(tag);
    }
  };

  return (
    <Box>
      <Box className="sun-editor" id="custom_toolbar" />
      <Stack bgColor="white" direction="row" p={2} spacing={2}>
        {options.map((option: string) => (
          <Button key={option} onClick={() => insertTag(`%${option}%`)} size="sm">
            {option}
          </Button>
        ))}
      </Stack>

      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        onChange={setHtml}
        setContents={value}
        setDefaultStyle="font-family: Arial, sans-serif;"
        setOptions={sunEditorOptions}
      />
    </Box>
  );
};

export default EmailEditor;
