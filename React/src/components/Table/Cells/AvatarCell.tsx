import React from 'react';

import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

import { IUser } from '../../../interfaces/IUser';

/**
 * AvatarCell Component
 * 
 * A reusable component that displays user avatars in a table cell format.
 * 
 * Features:
 * - Displays up to 3 visible avatars in a stacked layout
 * - Shows user count when multiple users are present
 * - Displays user name for single user scenarios
 * - Handles empty states with customizable text
 * - Supports partial user data with filtering
 * 
 * @param users - Array of user objects (can be partial IUser objects)
 * @param userType - Text label shown next to count when multiple users (default: "assigned")
 * @param noDataText - Text shown when no users are provided (default: "Unassigned")
 * 
 * @example
 * // Single user with name display
 * <AvatarCell users={[{_id: '1', displayName: 'John Doe', imgUrl: 'avatar.jpg'}]} />
 * 
 * // Multiple users with count
 * <AvatarCell 
 *   users={[user1, user2, user3, user4]} 
 *   userType="members" 
 * />
 * 
 * // Empty state
 * <AvatarCell users={[]} noDataText="No assignees" />
 */

// This component is used to display a stack of avatars in a table cell. If there is a single avatar it will display the avatar and also the users name.
function AvatarCell({ 
        users, 
        userType = "assigned", // when there is more than max visible users, this will be the text that will be shown next to the avatar count
        noDataText = "Unassigned", // when there is no data, this will be the text that will be shown
    } : { 
        users?: Partial<IUser>[], 
        userType?: string, 
        noDataText?: string,
    },
    ) {
    const maxVisible = 3;
    const filteredUsers = users?.filter((user) => user !== undefined) || [];
    const visibleUsers = filteredUsers?.slice(0, maxVisible) || [];

    return (users && users.length > 0 ? <Flex align="center" data-id="001210" gap="2px" w="full">
      <Flex align="center" data-id="001211" position="relative">
          {visibleUsers.map((user, index) => {
            const sanitizedName = (user?.displayName || '').replaceAll(/\s*\(.*?\)\s*/g, '');
            return (
              <Box
                data-id="001212"
                key={user._id}
                position="relative"
                style={{ marginLeft: index > 0 ? '-10px' : '0', zIndex: index }}>
                <Avatar
                  border="2px solid white"
                  borderRadius="6px"
                  boxSize="26px"
                  data-id="000231"
                  name={sanitizedName}
                  size="sm"
                  src={user?.imgUrl}
                />
              </Box>
            );
          })}
      </Flex>
      <Text
        color="auditsList.fontColor"
        data-id="001213"
        fontSize="14px"
        fontWeight="500">
        {users.length > 1 && `${filteredUsers.length} ${userType}`}
      </Text>
      { filteredUsers.length === 1 && 
          <Text
              data-id="000232"
              fontSize="14px"
              fontWeight="500"
              lineHeight="17px"
              opacity="1"
              overflow="hidden"
              textOverflow="ellipsis"
              w="full"
              whiteSpace="nowrap"
          >
              {filteredUsers[0]?.displayName}
          </Text>
      }
    </Flex> : <Flex data-id="000233" fontSize="14px" fontWeight="500">
      {noDataText}
    </Flex>);
}

export default AvatarCell;
