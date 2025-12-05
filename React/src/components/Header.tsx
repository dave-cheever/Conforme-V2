import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button, Divider, Flex, Text } from '@chakra-ui/react';
import { capitalize } from 'lodash';

import { useAdminContext } from '../contexts/AdminProvider';
import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import { useNavigationTopContext } from '../contexts/NavigationTopProvider';
import useConfig from '../hooks/useConfig';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { AddIcon, ArrowRight, ResetSearchIcon } from '../icons';
import Can from './can';
import FilterButton from './FilterButton';
import isAuditPage from '../utils/isAuditPage';

interface IHeader {
  breadcrumbs: string[];
  mobileBreadcrumbs?: string[];
  children?: React.ReactNode;
  pageLabel?: string;
}

function Header({ children, breadcrumbs, mobileBreadcrumbs, pageLabel }: IHeader) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { setSearchText } = useNavigationTopContext();
  const { usedFilters } = useFiltersContext();
  const { isPathActive, navigateTo } = useNavigate();
  const { setAdminModalState } = useAdminContext();
  const { trackerAddItems, auditAddItems } = useConfig();
  const { module } = useAppContext();

  const isAuditPageValue = isAuditPage(isPathActive);

  const handleResetSearch = () => {
    // Remove search parameter from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    setSearchParams(newSearchParams, { replace: true });
    // Clear search text from context
    setSearchText('');
  };

  function isPathAllowed() {
    const disallowedSuffixes = [
      'help',
      'answers',
      'terms-and-conditions',
      'privacy-policy',
      'audit-log',
      'settings',
      'notification-settings',
      'users',
      'insights',
      'actions',
    ];
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
    <Flex align="center" data-id="000272" h="full" key={`bc-${i}`}>
      {i > 0 && <ArrowRight color="#818197" data-id="000273" display="flex" ml={2} mr={1} mt={['4px', '5px']} />}
      <Text
        color={i === breadCrumbs.length - 1 ? 'header.breadcrumbPrimary' : 'header.breadcrumbSecondary'}
        data-id="000274"
        display={i === breadCrumbs.length - 1 ? 'flex' : 'flex'}
        fontSize={['18px', '20px']}
        fontWeight={i === breadCrumbs.length - 1 ? '700' : '400'}
        mr={1}
        pl={[0, 2]}
      >
        {capitalize(breadcrumb)}
      </Text>
    </Flex>
  );

  return (
    <Flex
      align="center"
      background="#ffffff"
      data-id="000275"
      h={'fit-content'}
      pb="10px"
      position="relative"
      px={['14px', '14px', '0']}
      zIndex="2"
      borderBottom={'1px solid #CBD5E0'}
    >
      <Flex data-id="000276" flexDirection="column" justify="space-between" pb="1" rowGap={[4, 0, 0]} w="full">
        <Flex data-id="000277" display="flex" flexShrink={0} ml={[0, 0, '5']} pt={[1, 4, 4]}>
          {breadCrumbs.map(renderBreadcrumb)}
        </Flex>
        {searchQuery && (
          <Flex
            data-id="003356"
            ml={['0', '0', '5']}
            pl={[0, 2]}
            mt={'2'}
            align="center"
            gap={2}>
            <Text data-id="003357" fontSize="16px" fontWeight="500" color="#4A5568">
              Search results for "{searchQuery}"
            </Text>

            <Flex
              data-id="003358"
              align="center"
              gap={1}
              cursor="pointer"
              onClick={handleResetSearch}
              _hover={{ opacity: 0.8 }}>
              <ResetSearchIcon data-id="003359" boxSize="18px" color="#0073E6" />
              <Text
                data-id="003360"
                fontSize="16px"
                fontWeight="500"
                color="#0073E6"
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}>
                Reset Search
              </Text>
            </Flex>
          </Flex>
        )}

        <Flex data-id="001518" direction={['column', 'column', 'row']} rowGap={['10px', '10px', '0']}>
          <Flex data-id="000278" justify="flex-end" mr="15px" w="full">
            {children}
          </Flex>
          {device === 'desktop' && usedFilters && isAuditPageValue && usedFilters.length > 0 && <FilterButton data-id="000279" />}

          {isPathAllowed() && (
            <Can
              action="audits.add"
              data-id="000280"
              yes={() => (
                <>
                  {usedFilters && isAuditPageValue && usedFilters.length > 0 && (
                    <Divider
                      borderColor="gray.300"
                      data-id="000281"
                      display={['none', 'none', 'block']}
                      height="30px"
                      ml={0}
                      mr={5}
                      mt={1}
                      orientation="vertical"
                    />
                  )}

                  <Button
                    _hover={{ opacity: 0.7 }}
                    aria-label="Add"
                    bg="navigationTop.addButton"
                    bottom={['78px', '0']}
                    boxShadow={['0px 0px 80px rgba(49, 50, 51, 0.25)', 'none']}
                    color="white"
                    data-id="000282"
                    display={['none', 'flex']}
                    flexShrink={0}
                    fontSize={['12px', '14px']}
                    fontWeight={'500'}
                    h={['42px', '40px']}
                    leftIcon={<AddIcon data-id="000283" h={['10px', '17px']} stroke="navigationTop.addIcon" w={['10px', '17px']} />}
                    ml={['0', '0', '4']}
                    onClick={() => {
                      const targetUrl = item?.url === '/dashboards' ? '/admin/tracker-items' : item?.url;
                      navigateTo(targetUrl || '');
                      setAdminModalState('add');
                    }}
                    position={['fixed', 'relative']}
                    right={['0', '0', usedFilters.length > 0 ? '15' : '25']}
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
