import React from 'react';

import { Avatar } from '@chakra-ui/react';

import { AuditCompleteIcon, AuditMissedIcon, AuditUpcomingIcon } from '../../../icons';
import AuditDateIcon from '../../../icons/AuditDateIcon';
import AuditDetailIcon from '../../../icons/AuditDetailIcon';
import { PanelConfig } from '../../../interfaces/IPanelConfig';

const auditPanelConfig: PanelConfig = {
  title: {
    primary: {
      key: 'reference',
      type: 'text',
      fallback: 'No Reference',
    },
    secondary: {
      key: 'auditType.name',
      type: 'text',
      fallback: 'No Audit Type',
    },
  },
  status: {
    key: 'status',
    type: 'badge',
    badgeConfig: {
      variant: 'solid',
      statusConfig: {
        upcoming: {
          bg: '#F97316',
          color: 'white',
          icon: AuditUpcomingIcon,
          text: 'Upcoming',
        },
        completed: {
          bg: '#0073E6',
          color: 'white',
          icon: AuditCompleteIcon,
          text: 'Completed',
        },
        missed: {
          bg: '#FC5960',
          color: 'white',
          icon: AuditMissedIcon,
          text: 'Missed',
        },
      },
    },
    fallback: 'Unknown',
  },
  details: [
    {
      key: 'dueDate',
      type: 'date',
      dateFormat: 'd MMM yyyy',
      icon: AuditDateIcon,
      fallback: 'No Due Date',
    },
    {
      key: 'auditor',
      type: 'custom',
      fallback: 'Unassigned',
      render: (auditor: any) => {
        if (!auditor) return 'Unassigned';

        return React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
          },
          [
            React.createElement(Avatar, {
              key: 'avatar',
              size: 'xs',
              width: '16px',
              height: '16px',
              src: auditor.imgUrl || undefined,
              name: auditor.displayName,
              bg: '#3182CE',
            }),
            React.createElement(
              'span',
              {
                key: 'name',
                style: {
                  fontSize: '14px',
                  color: '#4A5568',
                  fontWeight: 600,
                },
              },
              auditor.displayName || 'Unknown',
            ),
          ],
        );
      },
    },
  ],
  actions: {
    primary: {
      label: 'Audit Details',
      icon: AuditDetailIcon,
      onClick: () => {
        // This will be set by the parent component
        // Navigate handled by parent component
      },
    },
    secondary: {
      label: 'View Details',
      onClick: () => {
        // Secondary action handled by parent component
      },
    },
  },
};

export default auditPanelConfig;
