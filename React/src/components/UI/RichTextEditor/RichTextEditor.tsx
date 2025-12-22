import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { Box } from '@chakra-ui/react';
import { Asterisk } from '../../../icons';
import { IField } from '../../../interfaces/IField';

interface IRichTextEditor extends IField {
  readonly placeholder?: string;
}

interface IRichTextEditorInner {
  readonly value: string | undefined;
  readonly onChange: (value: string) => void;
  readonly error?: { message?: string };
  readonly label?: string;
  readonly placeholder: string;
  readonly required?: boolean;
  readonly disabled: boolean;
  readonly name: string;
}

const RichTextEditorInner = ({
  value,
  onChange,
  error,
  label,
  placeholder,
  required,
  disabled,
  name,
}: Readonly<IRichTextEditorInner>) => {
  const [editorState, setEditorState] = useState<EditorState>(() => {
    if (value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
          contentBlock.entityMap,
        );
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  // Update editor state when value changes externally
  useEffect(() => {
    if (value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
          contentBlock.entityMap,
        );
        const newEditorState = EditorState.createWithContent(contentState);
        // Only update if the content is different to avoid unnecessary re-renders
        const currentContent = editorState.getCurrentContent();
        if (currentContent.getPlainText() !== contentState.getPlainText()) {
          setEditorState(newEditorState);
        }
      }
    } else if (!value) {
      const currentContent = editorState.getCurrentContent();
      if (currentContent.hasText()) {
        setEditorState(EditorState.createEmpty());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const htmlContent = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    onChange(htmlContent);
  };

  return (
    <Box data-id={`rich-text-editor-${name}`} mt="none" w="full">
      {label && (
        <Box
          color={error ? 'textInput.labelFont.error' : 'textInput.labelFont.normal'}
          data-id={`rich-text-editor-label-${name}`}
          fontSize="11px"
          fontWeight="bold"
          mb={2}
        >
          {label}
          {required && (
            <Asterisk
              data-id={`rich-text-editor-asterisk-${name}`}
              fill="questionListElement.iconAsterisk"
              h="9px"
              mb="8px"
              ml="5px"
              stroke="questionListElement.iconAsterisk"
              w="9px"
            />
          )}
        </Box>
      )}
      <Box
        borderColor={error ? 'textInput.border.error' : 'textInput.border.normal'}
        borderRadius="8px"
        borderWidth="1px"
        data-id={`rich-text-editor-wrapper-${name}`}
        opacity={disabled ? 0.6 : 1}
        pointerEvents={'auto'}
      >
        <Editor
          data-id="013203"
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          placeholder={placeholder}
          readOnly={disabled}
          toolbar={{
            options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'remove'],
            inline: {
              options: ['bold', 'italic', 'underline'],
            },
            blockType: {
              options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote'],
            },
            list: {
              options: ['unordered', 'ordered'],
            },
          }}
          toolbarStyle={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            visibility: 'visible',
            cursor: disabled ? 'default' : 'pointer',
            pointerEvents: disabled ? 'none' : 'auto',
            opacity: disabled ? 0.6 : 1,
          }}
          wrapperStyle={{
            border: 'none',
          }}
          editorStyle={{
            minHeight: '200px',
            padding: '12px',
            border: 'none',
            backgroundColor: disabled ? 'gray.50' : 'transparent',
          }} />
      </Box>
      {error && (
        <Box color="textInput.error" data-id={`rich-text-editor-error-${name}`} fontSize={14} ml={1} mt={1}>
          {error.message}
        </Box>
      )}
    </Box>
  );
}

function RichTextEditor({
  control,
  name,
  label,
  placeholder = '',
  required,
  disabled = false,
  tooltip = '',
}: Readonly<IRichTextEditor>) {
  return (
    <Controller
      data-id="013202"
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { onChange, value } = field;
        const { error } = fieldState;
        return (
          <RichTextEditorInner
            data-id="013204"
            value={value}
            onChange={onChange}
            error={error}
            label={label}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            name={name} />
        );
      }} />
  );
}

export default RichTextEditor;

