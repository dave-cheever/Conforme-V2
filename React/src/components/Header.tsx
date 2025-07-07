import { useMemo } from 'react';

import { Divider, Flex, Text } from '@chakra-ui/react';
import { capitalize } from 'lodash';

import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { ArrowRight } from '../icons';
import Can from './can';
import FilterButton from './FilterButton';

interface IHeader {
  breadcrumbs: string[];
  mobileBreadcrumbs?: string[];
  children?: React.ReactNode;
  pageLabel?: string;
}

function Header({ children, breadcrumbs, mobileBreadcrumbs }: IHeader) {
  const { usedFilters } = useFiltersContext();
  const { isPathActive } = useNavigate();

  const isAuditPage =
    isPathActive('/audits') ||
    isPathActive('/actions') ||
    isPathActive('/answers') ||
    isPathActive('/dashboard') ||
    isPathActive('/tracker-items');
  const excludedPaths = [
    '/documents/admin/users',
    '/documents/admin/audit-log',
    '/documents/admin/settings',
    '/documents/help',
    '/documents/terms-and-conditions',
    '/documents/privacy-policy',
    '/safety-health-environment-walk/admin/settings',
    '/safety-health-environment-walk/answers',
    '/safety-health-environment-walk/admin/audit-log',
    '/safety-health-environment-walk/admin/users',
    '/safety-health-environment-walk/insights',
    '/safety-health-environment-walk/actions',
    '/safety-health-environment-walk/help',
    '/safety-health-environment-walk/terms-and-conditions',
    '/safety-health-environment-walk/privacy-policy',
  ];

  function isPathAllowed() {
    return !excludedPaths.includes(window.location.pathname);
  }

  const device = useDevice();
  const breadCrumbs = useMemo(() => breadcrumbs, [device, breadcrumbs, mobileBreadcrumbs]);

  const renderBreadcrumb = (breadcrumb: string, i: number) => (
    <Flex align="center" data-id="bed31f747997" h="full" key={`bc-${i}`}>
      {i > 0 && <ArrowRight color="#818197" data-id="1507ccf9eca0" display="flex" ml={2} mr={1} mt={['4px', '5px']} />}
      <Text
        color={i === breadCrumbs.length - 1 ? 'header.breadcrumbPrimary' : 'header.breadcrumbSecondary'}
        data-id="4e3ce528c3ed"
        display={i === breadCrumbs.length - 1 ? 'flex' : 'flex'}
        fontSize="20px"
        fontWeight={i === breadCrumbs.length - 1 ? '700' : '400'}
        mr={1}
        pl={[0, 2]}
      >
        {capitalize(breadcrumb)}
      </Text>
    </Flex>
  );

  return (
    <Flex align="center" background="#ffffff" data-id="254db3433c08" h={['60px', '70px']} pb="10px" position="relative" zIndex="2">
      <Flex data-id="29c8a722c6a3" justify="space-between" w="full">
        <Flex data-id="20c16a3e4d08" display="flex" flexShrink={0} ml="5">
          {breadCrumbs.map(renderBreadcrumb)}
        </Flex>
        <Flex data-id="5fd3aa3efb55" justify="flex-end" mr="15px" w="full">
          {children}
        </Flex>
        {usedFilters && isAuditPage && usedFilters.length > 0 && <FilterButton data-id="b947f2c69a3e" />}

        {isPathAllowed() && (
          <Can
            action="audits.add"
            data-id="a3a476596997"
            yes={() => (
              <>
                {usedFilters && isAuditPage && usedFilters.length > 0 && (
                  <Divider borderColor="gray.300" display={['none', 'block']} height="30px" ml={0} mr={5} mt={1} orientation="vertical" />
                )}

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
