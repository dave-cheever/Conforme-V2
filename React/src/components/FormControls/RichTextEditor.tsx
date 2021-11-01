import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Box, Flex, Icon, Text, Tooltip } from '@chakra-ui/react';

import { IFieldComponent } from '../Field';

const RichTextEditor = ({ name, label, showDot, tooltip, disabled, value, error, touched, onChange, onBlur }: IFieldComponent) => {
  const contentBlock = htmlToDraft(value);
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createWithContent(contentState));

  const toolbarOptions = {
    options: ['inline', 'textAlign', 'fontSize', 'list', 'colorPicker', 'history'], //, 'blockType', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
    inline: {
      options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
    },
    textAlign: {
      options: ['left', 'center', 'right', 'justify'],
    },
    fontSize: {
      options: [8, 10, 12, 14, 16, 18, 20, 22, 24],
    },
    list: {
      options: ['unordered', 'ordered', 'indent', 'outdent'],
    },
    colorPicker: {
      colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
        'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
        'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
        'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
        'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
        'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
    },
    history: {
      options: ['undo', 'redo'],
    },
  };

  const handleChange = editorState => {
    setEditorState(editorState);
  };

  const handleBlur = () => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    onChange({ target: { name, value: html } });
    onBlur({ target: { name } });
  };

  const renderFieldCircle = () => {
    if (!showDot) {
      return <Box w="50px" />;
    }
    return <Box flexShrink={0} bg={error ? 'red.500' : 'green.500'} h="14px" w="14px" mx="18px" mt="2px" borderRadius="100%" />;
  };

  const renderError = () => {
    if (!error || !touched) {
      return null;
    }
    return (<Box color="red.500">{error}</Box>);
  };

  const renderToolTip = () => {
    return (<Tooltip hasArrow aria-label={tooltip || ''} label={tooltip} placement="right"><Icon name="info" mb={1} h="14px" /></Tooltip>)
  }

  return (
    <Box id={name}>
      <Text mt={4} mb={2}>{label}{tooltip && renderToolTip()}</Text>
      <Flex position='relative' left="-50px" justifyContent='flex-start' alignItems='center' maxWidth='800px'>
        {renderFieldCircle()}
        <Editor
          editorState={editorState}
          toolbar={toolbarOptions}
          // editorClassName={`${css.rte} ${globalCss.scroll}`}
          onEditorStateChange={handleChange}
          onBlur={handleBlur}
          readOnly={disabled}
        />
      </Flex>
      {renderError()}
    </Box>
  );
};

export default RichTextEditor;
