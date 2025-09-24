import { useMemo } from 'react';

import { Button, Divider, Flex, Text } from '@chakra-ui/react';
import { capitalize } from 'lodash';

import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import useConfig from '../hooks/useConfig';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { AddIcon, ArrowRight } from '../icons';
import Can from './can';
import FilterButton from './FilterButton';

interface IHeader {
  breadcrumbs: string[];
  mobileBreadcrumbs?: string[];
  children?: React.ReactNode;
  pageLabel?: string;
}

function Header({ children, breadcrumbs, mobileBreadcrumbs, pageLabel }: IHeader) {
  const { usedFilters } = useFiltersContext();
  const { isPathActive, navigateTo } = useNavigate();
  const { setAdminModalState } = useAdminContext();
  const { trackerAddItems, auditAddItems } = useConfig();
  const { module } = useAppContext();

  const isAuditPage =
    isPathActive('/audits') ||
    isPathActive('/actions') ||
    isPathActive('/answers') ||
    isPathActive('/dashboard') ||
    isPathActive('/tracker-items');
  
  function isPathAllowed() {
  const disallowedSuffixes = ['help', 'answers', 'terms-and-conditions', 'privacy-policy', 'audit-log', 'settings', 'users', 'insights', 'actions'];
  const segments = window.location.pathname.split('/').filter(Boolean); 
  const lastSegment = segments[segments.length - 1];
  return !disallowedSuffixes.includes(lastSegment);
 }

  const item =
    module?.type === 'audits'
      ? auditAddItems.find((item) => item.label === pageLabel)
      : trackerAddItems.find((item) => item.label === pageLabel);

  const device = useDevice();
  const breadCrumbs = useMemo(() => breadcrumbs, [device, breadcrumbs, mobileBreadcrumbs]);

  const renderBreadcrumb = (breadcrumb: string, i: number) => (
    <Flex data-id="000272" align="center" h="full" key={`bc-${i}`}>
      {i > 0 && <ArrowRight data-id="000273" color="#818197" display="flex" ml={2} mr={1} mt={['4px', '5px']} />}
      <Text
        data-id="000274"
        color={i === breadCrumbs.length - 1 ? 'header.breadcrumbPrimary' : 'header.breadcrumbSecondary'}
        display={i === breadCrumbs.length - 1 ? 'flex' : 'flex'}
        fontSize={["18px", "20px"]}
        fontWeight={i === breadCrumbs.length - 1 ? '700' : '400'}
        mr={1}
        pl={[0, 2]}
      >
        {capitalize(breadcrumb)}
      </Text>
    </Flex>
  );

  return (
    <Flex data-id="000275" align="center" background="#ffffff" h={['60px', '70px']} pb="10px" position="relative" zIndex="2">
      <Flex data-id="000276" justify="space-between" w="full">
        <Flex data-id="000277" display="flex" flexShrink={0} ml="5">
          {breadCrumbs.map(renderBreadcrumb)}
        </Flex>
        <Flex data-id="000278" justify="flex-end" mr="15px" w="full">
          {children}
        </Flex>
        {usedFilters && isAuditPage && usedFilters.length > 0 && <FilterButton data-id="000279" />}

        {isPathAllowed() && (
          <Can
            data-id="000280"
            action="audits.add"
            yes={() => (
              <>
                {usedFilters && isAuditPage && usedFilters.length > 0 && (
                  <Divider
                    data-id="000281"
                    borderColor="gray.300"
                    display={['none', 'block']}
                    height="30px"
                    ml={0}
                    mr={5}
                    mt={1}
                    orientation="vertical" />
                )}

                <Button
                  data-id="000282"
                  _hover={{ opacity: 0.7 }}
                  aria-label="Add"
                  bg="navigationTop.addButton"
                  bottom={['78px', '0']}
                  boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.25)', 'none']}
                  color="white"
                  display={['none', 'flex']}
                  flexShrink={0}
                  fontSize={['12px', '14px']}
                  fontWeight={'500'}
                  h={['42px', '40px']}
                  leftIcon={<AddIcon data-id="000283" h={['10px', '17px']} stroke="navigationTop.addIcon" w={['10px', '17px']} />}
                  ml={['0', '4']}
                  mr={['6rem', '0']}
                  onClick={() => {
                    const targetUrl = item?.url === '/dashboards' ? '/admin/tracker-items' : item?.url;
                    navigateTo(targetUrl || '');
                    setAdminModalState('add');
                  }}
                  position={['fixed', 'relative']}
                  right={['0', usedFilters.length > 0 ? '15' : '25']}
                  rounded={['10px', '8px']}
                  w={['auto']}
                  zIndex={5}
                >
                  {`Add ${item?.label || ''}`}
                </Button>
              </>
            )}
          />
        )}
      </Flex>
    </Flex>
  );
}

export default Header;

export const headerStyles = {
  header: {
    bg: '#2B3236',
    breadcrumbPrimary: '#282F36',
    breadcrumbSecondary: '#818197',
    countFontColor: '#424B50',
    filterBackgroundColor: '#282F36',
    selectedFilterColor: '#818197',
  },
};
