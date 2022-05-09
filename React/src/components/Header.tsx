import { FunctionComponent, useMemo } from 'react';

import { Flex, Text } from '@chakra-ui/react';

import { useFiltersContext } from '../contexts/FiltersProvider';
import useDevice from '../hooks/useDevice';
import useNavigate from '../hooks/useNavigate';
import { ArrowRight, Filter } from '../icons';

interface IHeader {
  breadcrumbs: string[];
  mobileBreadcrumbs?: string[];
}

const Header: FunctionComponent<IHeader> = ({
  children,
  breadcrumbs,
  mobileBreadcrumbs,
}) => {
  const {
    usedFilters,
    showFiltersPanel,
    setShowFiltersPanel,
    numberOfSelectedFilters,
  } = useFiltersContext();
  const { isPathActive } = useNavigate();
  const isAuditPage =
    isPathActive('/audits') ||
    isPathActive('/actions') ||
    isPathActive('/dashboard');

  const device = useDevice();
  const breadCrumbs = useMemo(() => {
    if (device === 'mobile') return mobileBreadcrumbs || [];

    return breadcrumbs;
  }, [device, breadcrumbs, mobileBreadcrumbs]);

  const renderBreadcrumb = (breadcrumb: string, i: number) => (
    <Flex align="center" h="full" key={`bc-${i}`}>
      {i > 0 && (
        <ArrowRight
          color="#818197"
          display="flex"
          ml={2}
          mr={1}
          mt={['0px', '5px']}
        />
      )}
      <Text
        color={
          i === breadCrumbs.length - 1
            ? 'header.breadcrumbPrimary'
            : 'header.breadcrumbSecondary'
        }
        display={i === breadCrumbs.length - 1 ? 'flex' : 'flex'}
        fontWeight={i === breadCrumbs.length - 1 ? '700' : '400'}
        mr={1}
        pl={[0, 2]}
      >
        {breadcrumb}
      </Text>
    </Flex>
  );

  return (
    <Flex align="center" h={['60px', '70px']} position="relative">
      <Flex justify="space-between" w="full">
        <Flex display="flex" flexShrink={0} ml="6">
          {breadCrumbs.map(renderBreadcrumb)}
        </Flex>
        <Flex justify="flex-end" mr="20px" w="full">
          {children}
        </Flex>
        {usedFilters && isAuditPage && usedFilters.length > 0 && (
          <Flex
            align="center"
            bg="header.filterBackgroundColor"
            borderRadius="10px"
            color="brand.primaryFont"
            cursor="pointer"
            flexShrink={0}
            fontSize="sm"
            h="40px"
            justify="space-between"
            minW="120px"
            mr={[6, 6, 4]}
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            p={4}
          >
            <Flex color="white" fontSize="14px" fontWeight="bold">
              Filters
            </Flex>
            {numberOfSelectedFilters > 0 && (
              <Flex
                align="center"
                bg="header.selectedFilterColor"
                borderRadius="10px"
                color="white"
                fontSize="12px"
                fontWeight="400"
                h="20px"
                justify="center"
                lineHeight="14px"
                mx="2"
                w="27px"
              >
                {numberOfSelectedFilters}
              </Flex>
            )}
            <Filter
              h="18px"
              ml={3}
              transform={numberOfSelectedFilters > 0 ? 'rotate(180deg)' : ''}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
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
