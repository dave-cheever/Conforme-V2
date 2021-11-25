import React, { useRef } from 'react';
import { Button, Box, Stack } from '@chakra-ui/react';
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
  height: '100%',
  minHeight: '300px',
  maxHeight: 'calc(100vh - 520px)',
  toolbarContainer: '#custom_toolbar',
};

const EmailEditor = ({ setHtml, value, options }) => {
  const editorRef = useRef();

  const insertTag = (tag: string) => {
    if (editorRef && editorRef.current) {
      // @ts-expect-error
      editorRef.current.editor.insertHTML(tag);
    }
  }

  return (
    <Box>
      <Box id="custom_toolbar" className="sun-editor" />
      <Stack direction='row' bgColor='white' p={2} spacing={2}>
        {options.map((option: string) =>
          <Button
            key={option}
            size='sm'
            onClick={() => insertTag(`%${option}%`)}
          >{option}</Button>
        )}
      </Stack>
      <SunEditor
        //@ts-ignore
        ref={editorRef}
        setContents={value}
        //@ts-ignore
        setOptions={sunEditorOptions}
        setDefaultStyle="font-family: Arial, sans-serif;"
        onChange={setHtml}
      />
    </Box>
  )
};

export default EmailEditor;
