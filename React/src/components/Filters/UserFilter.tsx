import React, { useMemo } from "react"
import { Checkbox, CheckboxGroup, Flex, Stack, Avatar } from '@chakra-ui/react';

import { useFiltersContext } from "../../contexts/FiltersProvider";

const UserFilter = () => {
  const {
    filtersValues,
    setFilters,
    users,
  } = useFiltersContext();
  const value = useMemo(() => filtersValues.users?.value, [filtersValues]) as string[];

  return (
    <CheckboxGroup onChange={newValue => setFilters({ users: newValue })} value={value}>
      <Stack overflow='auto' h='calc(100vh - 230px)' pl='4' pb={2} direction="column" w='full'>
        {users.map(({ _id, displayName, imgUrl }) =>
          <Checkbox
            w='full'
            key={_id}
            value={_id}
            css={{
              ".chakra-checkbox__control": {
                borderRadius: "50%",
                width: "21px",
                height: "21px",
                "&[data-checked]": {
                  background: "#1C8586",
                  borderColor: "#1C8586",
                  "&[data-hover]": {
                    background: "#1C8586",
                    borderColor: "#1C8586"
                  }
                }
              },
              ".chakra-checkbox__label": {
                width: "100%",
              }
            }}
          >
            <Flex h='30px' w='full' pr={2}>
              <Avatar borderColor='brand.active' rounded='full' name={displayName} size='sm' src={imgUrl} mx={3} />
              <Flex
                h='30px'
                fontSize='13px'
                px={2}
                w='full'
                align='center'
                roundedRight='md'
                bg={_id && value.includes(_id) ? '#018587' : '#F2F2F2'}
                color={_id && value.includes(_id) ? '#FFFFFF' : '#2B3236'}
              >
                {displayName}
              </Flex>
            </Flex>
          </Checkbox>)
        }
      </Stack>
    </CheckboxGroup>
  );
};

export default UserFilter;