import React, { useEffect, useRef } from 'react';

import { Button, HStack, Input, Spinner, Text, VStack } from '@chakra-ui/react';
import { CrossIcon, SaveIcon } from '../../icons';
import { MAX_PRESET_NAME_LENGTH } from '../../bootstrap/config';
import { isIOSDevice } from '../../utils/helpers';

interface SavePresetFormProps {
  readonly presetName: string;
  readonly onPresetNameChange: (name: string) => void;
  readonly onSave: () => void;
  readonly onCancel: () => void;
  readonly dataId: string;
  readonly isSaving: boolean;
}

function SavePresetForm({ presetName, dataId, isSaving, onPresetNameChange, onSave, onCancel }: SavePresetFormProps) {
  const isOverLimit = presetName.length > MAX_PRESET_NAME_LENGTH;
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const bodyOverflowRef = useRef<string>('');

  useEffect(() => {
    if (!isIOSDevice() || !inputRef.current) return;

    const input = inputRef.current;
    let scrollRestoreTimeout: NodeJS.Timeout;

    const handleFocus = () => {
      // Store current scroll position before iOS tries to scroll
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;

      // Store current body styles (FiltersPanel may have already set some)
      bodyOverflowRef.current = document.body.style.overflow || '';
      const currentPosition = document.body.style.position || '';
      const currentTop = document.body.style.top || '';

      // Use requestAnimationFrame to apply fixes after iOS's initial scroll attempt
      requestAnimationFrame(() => {
        // Ensure body is locked (FiltersPanel may have already done this, but we ensure it)
        document.body.style.overflow = 'hidden';

        // Only set position fixed if not already set by FiltersPanel
        if (!currentPosition || currentPosition !== 'fixed') {
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.top = `-${scrollPositionRef.current}px`;
        } else {
          // If FiltersPanel already set it, just ensure top is correct
          const existingTop = currentTop ? Number.parseInt(currentTop.replace('-', '')) : scrollPositionRef.current;
          document.body.style.top = `-${existingTop}px`;
        }

        // Prevent any further scrolling
        window.scrollTo(0, scrollPositionRef.current);
      });
    };

    const restoreScrollPosition = (y: number) => {
      requestAnimationFrame(() => window.scrollTo(0, y));
    };

    const handleBlur = () => {
      // Restore body styles after a short delay to ensure keyboard is dismissed
      scrollRestoreTimeout = setTimeout(() => {
        const savedScroll = scrollPositionRef.current;

        // Restore body styles to what they were before focus
        // Note: FiltersPanel will handle its own cleanup when panel closes
        document.body.style.overflow = bodyOverflowRef.current || 'hidden';

        // Only restore position if we changed it (not if FiltersPanel set it)
        if (bodyOverflowRef.current === '') {
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.top = '';
        }

        // Restore scroll position
        restoreScrollPosition(savedScroll);
      }, 150);
    };

    // Use capture phase to intercept before iOS handles it
    input.addEventListener('focus', handleFocus, true);
    input.addEventListener('blur', handleBlur, true);

    return () => {
      input.removeEventListener('focus', handleFocus, true);
      input.removeEventListener('blur', handleBlur, true);
      if (scrollRestoreTimeout) clearTimeout(scrollRestoreTimeout);

      // Cleanup: restore body styles if component unmounts while focused
      // But be careful not to override FiltersPanel's styles
      if (bodyOverflowRef.current === '') {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
      }
    };
  }, []);

  return (
    <VStack align="stretch" data-id="002338" spacing="4px" w="100%">
      <HStack data-id="003085" spacing="8px">
        <Input
          _focus={{
            borderColor: isOverLimit ? '#E53E3E' : '#CBD5E0',
            boxShadow: isOverLimit
              ? '0px 1px 2px 0px rgba(229, 62, 62, 0.05), 0px 0px 0px 4px rgba(229, 62, 62, 0.05)'
              : '0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(16, 24, 40, 0.05)',
          }}
          border={`1px solid ${isOverLimit ? '#E53E3E' : '#CBD5E0'}`}
          borderRadius="6px"
          data-id={`${dataId}-preset-input`}
          fontSize="14px"
          h="32px"
          isInvalid={isOverLimit}
          onChange={(e) => onPresetNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isOverLimit) onSave();
            else if (e.key === 'Escape') onCancel();
          }}
          placeholder="Preset name"
          value={presetName}
        />
        <Button
          _hover={{ bg: 'gray.50' }}
          bg="transparent"
          border="1px solid #CBD5E0"
          borderRadius="6px"
          data-id={`${dataId}-clear-button`}
          h="32px"
          minW="32px"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          p="0"
          variant="outline"
          w="32px"
        >
          <CrossIcon data-id="002339" h="10px" w="10px" />
        </Button>
        <Button
          _hover={{ opacity: 0.9 }}
          bg="#0068A3"
          borderRadius="6px"
          data-id={`${dataId}-confirm-save-button`}
          h="32px"
          isDisabled={isOverLimit}
          minW="32px"
          onClick={(e) => {
            e.stopPropagation();
            if (!isOverLimit) {
              onSave();
            }
          }}
          opacity={isOverLimit ? 0.5 : 1}
          p="0"
          variant="solid"
          w="32px"
          isLoading={isSaving}
          spinner={<Spinner data-id="003345" color="white" size="sm" />}
        >
          <SaveIcon color="white" data-id="002340" h="12px" stroke="white" w="12px" />
        </Button>
      </HStack>
      {isOverLimit && (
        <Text data-id="003086" color="#E53E3E" fontSize="12px" mt="4px">
          Preset name must be {MAX_PRESET_NAME_LENGTH} characters or less ({presetName.length}/{MAX_PRESET_NAME_LENGTH})
        </Text>
      )}
    </VStack>
  );
}

export default SavePresetForm;
