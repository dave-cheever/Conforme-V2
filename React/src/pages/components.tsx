import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import AvatarCell from '../components/Table/Cells/AvatarCell';

interface ComponentGroup {
  title: string;
  description: string;
  props: any;
  component: React.ReactNode;
}

interface ComponentSection {
  groupTitle: string;
  sections: ComponentGroup[];
  description: string;
}

const componentSections: ComponentSection[] = [
  {
    groupTitle: 'People Picker',
    description: 'AvatarCell Component - A reusable component that displays user avatars in a table cell format. Features: Displays up to 3 visible avatars in a stacked layout, shows user count when multiple users are present, displays user name for single user scenarios, handles empty states with customizable text, and supports partial user data with filtering. Props: users (array of user objects), userType (text label shown next to count, default: "assigned"), noDataText (text shown when no users provided, default: "Unassigned").',
    sections: [
      {
        title: 'Single user',
        description: 'Single user selection with search and avatar display',
        props: {
          users: [{_id: '1', displayName: 'John Doe', imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}]
        },
        get component() { return <AvatarCell {...this.props} />; },
      },
      {
        title: 'Three users',
        description: 'Three users selection with search and avatar display',
        props: {
          users: [{_id: '1', displayName: 'John Doe', imgUrl: 'https://example.com/john.jpg'}, {_id: '2', displayName: 'Jane Doe', imgUrl: 'https://example.com/jane.jpg'}, {_id: '3', displayName: 'Jim Doe', imgUrl: 'https://example.com/jim.jpg'}],
        },
        get component() { return <AvatarCell {...this.props} />; },
      },
      {
        title: 'Five users',
        description: 'Five users selection showing avatar stacking with count display and userType set to users',
        props: {
          users: [
            {_id: '1', displayName: 'John Doe', imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}, 
            {_id: '2', displayName: 'Jane Doe', imgUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'}, 
            {_id: '3', displayName: 'Jim Doe', imgUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'},
            {_id: '4', displayName: 'Jack Doe', imgUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'},
            {_id: '5', displayName: 'Jill Doe', imgUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'}
          ],
          userType: 'users',
        },
        get component() { return <AvatarCell {...this.props} />; },
      },
      {
        title: 'No users',
        description: 'Empty state showing default "Unassigned" text when no users are provided',
        props: {
          users: [],
        },
        get component() { return <AvatarCell {...this.props} />; },
      }



    ]
  },    
];


function Components() {
  return (
    <Flex
      data-id="components-page"
      flexDirection="column"
      h="full"
      overflow="auto"
      w="full"
    >
      <Flex
        bg="white"
        borderRadius="20px"
        data-id="components-content"
        flexDirection="column"
        h="auto"
        maxWidth="full"
        mb={['25px', '25px']}
        ml="7"
        mr="25px"
        p="25px 30px"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Component Library
        </Text>
        <Text fontSize="md" color="gray.600" mb={8}>
          A list of reusable components provided for testing purposes.
          This page is only visible when the <b>VITE_COMPONENTS_PAGE_ENABLED</b> environment variable is set to <b>true</b>.
        </Text>

        {componentSections.map(section => (
          <Box key={section.groupTitle} mb={12}>
            {/* Group Title */}
            <Text fontSize="2xl" fontWeight="bold" mb={6} color="brand.primary" borderBottom="2px" borderColor="brand.primary" pb={2}>
              {section.groupTitle}
            </Text>

            {section.description && (
              <Text fontSize="md" color="gray.600" mb={4}>
                {section.description}
              </Text>
            )}

            {/* Subsections within the group */}
            {section.sections.map(subsection => (
              <Box key={subsection.title} mb={8} bg="gray.100">
                    <Box
                      border="2px"
                      borderColor="gray.200"
                      borderRadius="md"
                      p={4}
                      _hover={{ shadow: 'md', borderColor: 'brand.primary' }}
                      transition="all 0.2s"
                    >
                        <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
                            {subsection.title}
                        </Text>
                        <Text fontSize="md" color="gray.600" mb={4}>
                            {subsection.description}
                        </Text>
                        <Box mb={4}>
                        <Text fontSize="md" fontWeight="bold" mb={2} color="gray.600">Props:</Text>
                        {Object.entries(subsection.props).map(([key, value]) => (
                            <Text key={key} fontSize="md" color="gray.600">
                            <strong>{key}:</strong> {JSON.stringify(value)}
                            </Text>
                        ))}
                        </Box>  
                        <Flex bg="white">{subsection.component}</Flex>
                    </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Flex>
    </Flex>
  );
}

export default Components;
