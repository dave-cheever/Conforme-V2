import React from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import { actionPanelConfig, auditPanelConfig, incidentPanelConfig, trackerPanelConfig } from '../components/PanelView/configs';
import PanelView from '../components/PanelView/PanelView';
import AvatarCell from '../components/Table/Cells/AvatarCell';
import actionsData from '../mock-data/actions.data';
import incidentsData from '../mock-data/incidents.data';

// Mock audit data for demo
const mockAuditData = [
  {
    _id: 'audit1',
    reference: 'AUD-001',
    auditType: { name: 'Compliance Audit' },
    status: 'completed',
    dueDate: '2025-01-15T00:00:00Z',
    auditor: {
      displayName: 'John Doe',
      imgUrl: 'https://example.com/john.jpg',
    },
  },
  {
    _id: 'audit2',
    reference: 'AUD-002',
    auditType: { name: 'Safety Audit' },
    status: 'upcoming',
    dueDate: '2025-02-20T00:00:00Z',
    auditor: {
      displayName: 'Jane Smith',
      imgUrl: null,
    },
  },
];

// Mock tracker data for demo
const mockTrackerData = [
  {
    _id: 'tracker1',
    trackerItem: {
      name: 'Monthly Safety Inspection',
      category: { name: 'Safety Compliance' },
    },
    calculatedStatus: 'compliant',
    dueDate: '2025-01-31T00:00:00Z',
    assignedTo: 'Safety Team',
    regulatoryBody: { name: 'Health & Safety Authority' },
  },
  {
    _id: 'tracker2',
    trackerItem: {
      name: 'Quarterly Equipment Audit',
      category: { name: 'Equipment Maintenance' },
    },
    calculatedStatus: 'nonCompliant',
    dueDate: '2025-01-15T00:00:00Z',
    assignedTo: 'Maintenance Team',
    regulatoryBody: { name: 'Equipment Standards Board' },
  },
  {
    _id: 'tracker3',
    trackerItem: {
      name: 'Annual Training Review',
      category: { name: 'Staff Development' },
    },
    calculatedStatus: 'overdue',
    dueDate: '2024-12-31T00:00:00Z',
    assignedTo: 'HR Department',
    regulatoryBody: { name: 'Training Authority' },
  },
];

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
          users: [{_id: '1', displayName: 'John Doe', imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}],
        },
        get component() { return <AvatarCell data-id="002437" {...this.props} />; },
      },
      {
        title: 'Three users',
        description: 'Three users selection with search and avatar display',
        props: {
          users: [{_id: '1', displayName: 'John Doe', imgUrl: 'https://example.com/john.jpg'}, {_id: '2', displayName: 'Jane Doe', imgUrl: 'https://example.com/jane.jpg'}, {_id: '3', displayName: 'Jim Doe', imgUrl: 'https://example.com/jim.jpg'}],
        },
        get component() { return <AvatarCell data-id="002438" {...this.props} />; },
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
            {_id: '5', displayName: 'Jill Doe', imgUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'},
          ],
          userType: 'users',
        },
        get component() { return <AvatarCell data-id="002439" {...this.props} />; },
      },
      {
        title: 'No users',
        description: 'Empty state showing default "Unassigned" text when no users are provided',
        props: {
          users: [],
        },
        get component() { return <AvatarCell data-id="002440" {...this.props} />; },
      },

    ],
  },
  {
    groupTitle: 'Panel View Components',
    description: 'PanelView Component - A flexible and reusable component for displaying data in card-like panels. Features: Configurable layouts with title, status, details, and actions sections, support for different field types (text, badge, date, user, custom), responsive design with mobile/desktop layouts, hover effects and click handlers, linked item sections, and customizable styling. Perfect for displaying lists of audits, actions, incidents, and tracker items.',
    sections: [
      {
        title: 'Audit Panels',
        description: 'Displays audit information with status badges, due dates, and auditor details',
        props: {
          config: 'auditPanelConfig',
          items: 'mockAuditData (2 items)',
        },
        get component() { return <PanelView config={auditPanelConfig} data-id="002441" items={mockAuditData} />; },
      },
      {
        title: 'Action Panels',
        description: 'Shows action items with status, assignment, and linked items',
        props: {
          config: 'actionPanelConfig',
          items: 'actionsData (from mock-data)',
        },
        get component() { return <PanelView config={actionPanelConfig} data-id="002442" items={actionsData} />; },
      },
      {
        title: 'Incident Panels',
        description: 'Displays incident reports with severity levels, hospital information, and investigation status',
        props: {
          config: 'incidentPanelConfig',
          items: 'incidentsData (from mock-data)',
        },
        get component() { return <PanelView config={incidentPanelConfig} data-id="002443" items={incidentsData} />; },
      },
      {
        title: 'Tracker Panels',
        description: 'Shows compliance tracker items with regulatory body information and due dates',
        props: {
          config: 'trackerPanelConfig',
          items: 'mockTrackerData (3 items)',
        },
        get component() { return <PanelView config={trackerPanelConfig} data-id="002444" items={mockTrackerData} />; },
      },
    ],
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
        <Text data-id="002445" fontSize="2xl" fontWeight="bold" mb={6}>
          Component Library
        </Text>
        <Text color="gray.600" data-id="002446" fontSize="md" mb={8}>
          A list of reusable components provided for testing purposes.
          This page is only visible when the <b data-id="002447">VITE_COMPONENTS_PAGE_ENABLED</b> environment variable is set to <b data-id="002448">true</b>.
        </Text>

        {componentSections.map(section => (
          <Box data-id="002449" key={section.groupTitle} mb={12}>
            {/* Group Title */}
            <Text
              borderBottom="2px"
              borderColor="brand.primary"
              color="brand.primary"
              data-id="002450"
              fontSize="2xl"
              fontWeight="bold"
              mb={6}
              pb={2}>
              {section.groupTitle}
            </Text>

            {section.description && (
              <Text color="gray.600" data-id="002451" fontSize="md" mb={4}>
                {section.description}
              </Text>
            )}

            {/* Subsections within the group */}
            {section.sections.map(subsection => (
              <Box bg="gray.100" data-id="002452" key={subsection.title} mb={8}>
                    <Box
                      _hover={{ shadow: 'md', borderColor: 'brand.primary' }}
                      border="2px"
                      borderColor="gray.200"
                      borderRadius="md"
                      data-id="002453"
                      p={4}
                      transition="all 0.2s">
                        <Text
                          color="gray.700"
                          data-id="002454"
                          fontSize="lg"
                          fontWeight="semibold"
                          mb={4}>
                            {subsection.title}
                        </Text>
                        <Text color="gray.600" data-id="002455" fontSize="md" mb={4}>
                            {subsection.description}
                        </Text>
                        <Box data-id="002456" mb={4}>
                        <Text color="gray.600" data-id="002457" fontSize="md" fontWeight="bold" mb={2}>Props:</Text>
                        {Object.entries(subsection.props).map(([key, value]) => (
                            <Text color="gray.600" data-id="002458" fontSize="md" key={key}>
                            <strong data-id="002459">{key}:</strong> {JSON.stringify(value)}
                            </Text>
                        ))}
                        </Box>  
                        <Flex bg="white" data-id="002460">{subsection.component}</Flex>
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
