import { FunctionComponent, useMemo } from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { capitalize } from 'lodash';

import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { ArrowRight } from '../icons';
import FilterButton from './FilterButton';

interface IHeader {
  breadcrumbs: string[];
  mobileBreadcrumbs?: string[];
}

const Header: FunctionComponent<IHeader> = ({ children, breadcrumbs, mobileBreadcrumbs }) => {
  const { usedFilters } = useFiltersContext();
  const { isPathActive } = useNavigate();
  const isAuditPage =
    isPathActive('/audits') ||
    isPathActive('/actions') ||
    isPathActive('/walk-items') ||
    isPathActive('/dashboard') ||
    isPathActive('/tracker-items');

  const device = useDevice();
  const breadCrumbs = useMemo(() => {
    if (device === 'mobile') return mobileBreadcrumbs || [];

    return breadcrumbs;
  }, [device, breadcrumbs, mobileBreadcrumbs]);

  const renderBreadcrumb = (breadcrumb: string, i: number) => (
    <Flex align="center" data-id="bed31f747997" h="full" key={`bc-${i}`}>
      {i > 0 && <ArrowRight
        color="#818197"
        data-id="1507ccf9eca0"
        display="flex"
        ml={2}
        mr={1}
        mt={['0px', '5px']} />}
      <Text
        color={i === breadCrumbs.length - 1 ? 'header.breadcrumbPrimary' : 'header.breadcrumbSecondary'}
        data-id="4e3ce528c3ed"
        display={i === breadCrumbs.length - 1 ? 'flex' : 'flex'}
        fontWeight={i === breadCrumbs.length - 1 ? '700' : '400'}
        mr={1}
        pl={[0, 2]}>
        {capitalize(breadcrumb)}
      </Text>
    </Flex>
  );

  return (
    (<Flex
      align="center"
      data-id="254db3433c08"
      h={['60px', '70px']}
      position="relative"
      zIndex="2">
      <Flex data-id="29c8a722c6a3" justify="space-between" w="full">
        <Flex data-id="20c16a3e4d08" display="flex" flexShrink={0} ml="5">
          {breadCrumbs.map(renderBreadcrumb)}
        </Flex>
        <Flex data-id="5fd3aa3efb55" justify="flex-end" mr="15px" w="full">
          {children}
        </Flex>
        {usedFilters && isAuditPage && usedFilters.length > 0 && <FilterButton data-id="b947f2c69a3e" />}
      </Flex>
    </Flex>)
  );
};

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
