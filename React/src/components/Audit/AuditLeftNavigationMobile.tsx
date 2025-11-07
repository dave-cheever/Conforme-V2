import { useEffect, useRef, useCallback } from 'react';

import { Box, Divider, Flex, Text } from '@chakra-ui/react';

import useConfig from '../../hooks/useConfig';
import useNavigate from '../../hooks/useNavigate';
import { BackArrowIcon } from '../../icons';
import AuditLeftTabItem from './AuditLeftTabItem';

const SCROLL_POSITION_KEY = 'auditNavMobileScrollPosition';

// Helper function to chain multiple animation frame calls
function chainAnimationFrames(
  callback: () => void,
  count: number,
  rafIds: number[]
): void {
  if (count <= 0) return;
  
  const rafId = requestAnimationFrame(() => {
    callback();
    chainAnimationFrames(callback, count - 1, rafIds);
  });
  rafIds.push(rafId);
}

function AuditLeftNavigationMobile() {
  const { auditNavigationTabs } = useConfig();
  const { navigateTo } = useNavigate();
  
  const hasManyIcons = auditNavigationTabs.length >= 4;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRestoringRef = useRef<boolean>(false);

  // Save scroll position to sessionStorage
  const saveScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container && hasManyIcons && !isRestoringRef.current) {
      try {
        sessionStorage.setItem(SCROLL_POSITION_KEY, container.scrollLeft.toString());
      } catch (e) {
        console.warn('Failed to save scroll position to sessionStorage:', e);
      }
    }
  }, [hasManyIcons]);

  // Restore scroll position from sessionStorage
  const restoreScrollPosition = useCallback(() => {
    if (!hasManyIcons) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    try {
      const savedPosition = sessionStorage.getItem(SCROLL_POSITION_KEY);
      if (savedPosition !== null) {
        const position = Number.parseFloat(savedPosition);
        if (!Number.isNaN(position)) {
          isRestoringRef.current = true;
          container.scrollLeft = position;
          // Reset flag after a short delay
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 100);
        }
      }
    } catch (e) {
      console.warn('Failed to restore scroll position from sessionStorage:', e);
    }
  }, [hasManyIcons]);

  // Save scroll position on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && hasManyIcons) {
      const handleScroll = () => {
        saveScrollPosition();
      };
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasManyIcons, saveScrollPosition]);

  // Restore scroll position after mount and re-renders
  useEffect(() => {
    if (!hasManyIcons) return;
    
    // Try multiple times to ensure restoration happens after all updates
    const restore = () => {
      restoreScrollPosition();
    };
    
    // Immediate attempt
    restore();
    
    // After animation frames - chain multiple RAF calls sequentially
    const rafIds: number[] = [];
    chainAnimationFrames(restore, 3, rafIds);
    
    // Also try after a short timeout as fallback
    const timeoutId = setTimeout(restore, 50);
    
    return () => {
      for (const id of rafIds) {
        cancelAnimationFrame(id);
      }
      clearTimeout(timeoutId);
    };
  }, [hasManyIcons, restoreScrollPosition]);

  return (
    <Flex
      align="center"
      bg="navigationBottomMobile.bg"
      bottom="0px"
      maxH="92px"
      minH="92px"
      borderTop="1px solid"
      borderColor="#CBD5E0"
      color="auditLeftNavigation.color"
      data-id="000207"
      direction="column"
      display={['block', 'none', 'none']}
      fontWeight="400"
      h="fit-content"
      justifyContent="space-between"
      p="16px 16px"
      sx={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      w="full"
      zIndex={12}>
      <Flex align="center" data-id="000208" flexDirection="row" h="full">
        <Flex
          align="center"
          color="auditLeftNavigation.goBackColor"
          cursor="pointer"
          data-id="000209"
          fontSize="14px"
          h="100%"
          mr={4}
          onClick={() => navigateTo('/audits')}>
          <Box
            alignItems="center"
            bg="#E2E8F0"
            borderRadius="7px"
            data-id="002488"
            display="flex"
            flexDirection="column"
            gap="0px"
            height="56px"
            justifyContent="center"
            width="56px">
            <Flex
              align="center"
              borderRadius="8px"
              data-id="000210"
              h="30px"
              justify="center"
              w="30px">
              <BackArrowIcon data-id="002489" dataId="000211" width="18px" height="18px" fill="#4A5568" />
            </Flex>
            <Text
              color="#4A5568"
              data-id="000211"
              fontSize="12px"
              fontWeight="400"
              overflow="hidden"
              textAlign="center"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              width="85%">
              Back
            </Text>
          </Box>
          <Divider w={'2px'} color={'#CBD5E0'} h={'55px'} data-id="000212" ml={3} orientation="vertical" />
        </Flex>
        <Box
          ref={scrollContainerRef}
          data-id="000213" 
          w="full"
          overflowX={hasManyIcons ? "auto" : "visible"}
          overflowY="hidden"
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
          <Flex 
            data-id="000214" 
            justify={hasManyIcons ? "flex-start" : "space-between"} 
            w={hasManyIcons ? "max-content" : "full"}
            gap={hasManyIcons ? "16px" : "0"}>
            {auditNavigationTabs.map(({ label, icon, url }) => (
              <AuditLeftTabItem
                data-id="000215"
                icon={icon}
                key={url}
                label={label}
                url={url} />
            ))}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default AuditLeftNavigationMobile;
