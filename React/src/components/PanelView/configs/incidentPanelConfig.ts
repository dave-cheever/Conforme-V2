import React from 'react';

import { Building, CalendarIcon, CheckIcon, ComingUpIcon, DetailIcon, WarningIcon } from '../../../icons';
import AuditDetailIcon from '../../../icons/AuditDetailIcon';
import IncidentIcon from '../../../icons/IncidentIcon';
import { PanelConfig } from '../../../interfaces/IPanelConfig';

const incidentPanelConfig: PanelConfig = {
  header: {
    show: true,
    fields: [
      {
        key: 'hospital_name',
        type: 'custom',
        fallback: 'Unknown Hospital',
        render: (value: string) =>
          React.createElement(
            'span',
            {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'white',
                fontWeight: '600',
              },
            },
            [React.createElement(Building), value || 'Unknown Hospital'],
          ),
      },
      {
        key: 'ward_location',
        type: 'text',
        fallback: 'Unknown Location',
      },
      {
        key: 'severity',
        type: 'badge',
        badgeConfig: {
          variant: 'solid',
          statusConfig: {
            high: {
              bg: '#EF4444',
              color: 'white',
              text: 'High',
              icon: WarningIcon,
            },
            medium: {
              bg: '#F59E0B',
              color: 'white',
              text: 'Medium',
              icon: ComingUpIcon,
            },
            low: {
              bg: '#10B981',
              color: 'white',
              text: 'Low',
              icon: CheckIcon,
            },
          },
        },
        fallback: 'Unknown',
      },
    ],
  },
  title: {
    primary: {
      key: 'title',
      type: 'text',
      fallback: 'No Title',
    },
    secondary: {
      key: 'id',
      type: 'text',
      fallback: 'No ID',
    },
  },
  status: {
    key: 'status',
    type: 'badge',
    badgeConfig: {
      variant: 'solid',
      statusConfig: {
        'IN REVIEW': {
          bg: '#3B82F6',
          color: 'white',
          icon: DetailIcon,
          text: 'In Review',
        },
        Investigation: {
          bg: '#F59E0B',
          color: 'white',
          icon: WarningIcon,
          text: 'Investigation',
        },
        Escalated: {
          bg: '#EF4444',
          color: 'white',
          icon: WarningIcon,
          text: 'Escalated',
        },
        Closed: {
          bg: '#10B981',
          color: 'white',
          icon: CheckIcon,
          text: 'Closed',
        },
      },
    },
    fallback: 'Unknown',
  },
  details: [
    {
      key: 'description',
      type: 'text',
      icon: DetailIcon,
      fallback: 'No Description',
    },
    {
      key: 'owner',
      type: 'user',
      icon: DetailIcon,
      fallback: 'Unassigned',
    },
    {
      key: 'people_assigned',
      type: 'user',
      icon: DetailIcon,
      fallback: 'No one assigned',
    },
    {
      key: 'timestamp',
      type: 'date',
      dateFormat: 'd MMM yyyy, h:mm a',
      icon: CalendarIcon,
      fallback: 'No Date',
    },
    {
      key: 'criticality_level',
      type: 'badge',
      badgeConfig: {
        variant: 'solid',
        statusConfig: {
          Critical: {
            bg: '#DC2626',
            color: 'white',
            text: 'Critical',
            icon: WarningIcon,
          },
          high: {
            bg: '#EF4444',
            color: 'white',
            text: 'High',
            icon: WarningIcon,
          },
          medium: {
            bg: '#F59E0B',
            color: 'white',
            text: 'Medium',
            icon: ComingUpIcon,
          },
          low: {
            bg: '#10B981',
            color: 'white',
            text: 'Low',
            icon: CheckIcon,
          },
        },
      },
      fallback: 'Unknown',
    },
  ],
  linkedItem: {
    show: true,
    fieldKey: 'linked_item',
    label: 'Linked Action',
    render: (value: any) => {
      if (!value) return null;
      return React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: '#F7FAFC',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
          },
        },
        [
          React.createElement(IncidentIcon),
          React.createElement(
            'span',
            {
              style: {
                fontSize: '14px',
                fontWeight: '500',
                color: '#3182CE',
              },
            },
            `Linked Action: ${value}`,
          ),
        ],
      );
    },
  },
  actions: {
    primary: {
      label: 'View Incident',
      icon: AuditDetailIcon,
      onClick: () => {
        // This will be set by the parent component
        // Navigate handled by parent component
      },
    },
    secondary: {
      label: 'Edit Incident',
      onClick: () => {
        // Edit handled by parent component
      },
    },
  },
};

export default incidentPanelConfig;
