import React from 'react';

import { ActionDetailDate, ActionSeverityIcon, ActionTypeIcon, DetailIcon } from '../../../icons';
import AuditDetailIcon from '../../../icons/AuditDetailIcon';
import IncidentIcon from '../../../icons/IncidentIcon';
import RecordIcon from '../../../icons/RecordIcon';
import { PanelConfig } from '../../../interfaces/IPanelConfig';

const actionPanelConfig: PanelConfig = {
  header: {
    show: true,
    fields: [
      {
        key: 'module_type',
        type: 'custom',
        fallback: 'Unknown Type',
        render: (value: string) => {
          const iconMap = {
            Incident: IncidentIcon,
            Record: RecordIcon,
            default: DetailIcon,
          };

          const Icon = iconMap[value as keyof typeof iconMap] || iconMap.default;

          return React.createElement(
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
            [React.createElement(Icon, { key: 'type-icon' }), value || 'Unknown Type'],
          );
        },
      },
      {
        key: 'module_internal_id',
        type: 'text',
        fallback: 'No ID',
      },
      {
        key: 'module_internal_type',
        type: 'text',
        fallback: 'Unknown Internal Type',
      },
      {
        key: 'hospital_name',
        type: 'text',
        fallback: 'Unknown Hospital',
      },
    ],
  },
  title: {
    primary: {
      key: 'action_title',
      type: 'text',
      fallback: 'No Title',
    },
    secondary: {
      key: 'action_type',
      type: 'text',
      fallback: 'No Type',
    },
  },
  status: {
    key: 'status',
    type: 'badge',
    badgeConfig: {
      variant: 'solid',
      statusConfig: {
        'In Progress': {
          bg: '#0073E6',
          color: 'white',
          text: 'In Progress',
        },
        Completed: {
          bg: '#10B981',
          color: 'white',
          text: 'Completed',
        },
        Pending: {
          bg: '#F59E0B',
          color: 'white',
          text: 'Pending',
        },
      },
    },
    fallback: 'Unknown',
  },
  details: [
    {
      key: 'action_type',
      type: 'text',
      icon: ActionTypeIcon,
      fallback: 'No Type',
    },
    {
      key: 'action_assigned_to',
      type: 'user',
      fallback: 'Unassigned',
    },
    {
      key: 'action_end_date_timestamp',
      type: 'date',
      dateFormat: 'd MMM yyyy',
      icon: ActionDetailDate,
      fallback: 'No Due Date',
    },
    {
      key: 'action_SLA',
      type: 'text',
      fallback: 'No SLA',
    },
    {
      key: 'action_severity',
      type: 'text',
      icon: ActionSeverityIcon,
      textColorMap: {
        high: '#D0021B',
        medium: '#E46105',
        low: '#000000',
      },
      fallback: 'Unknown',
    },
  ],
  actions: {
    primary: {
      label: 'View Action',
      icon: AuditDetailIcon,
      onClick: () => {
        // This will be set by the parent component
        // handled by parent component
      },
    },
    secondary: {
      label: 'Edit Action',
      onClick: () => {
        // Edit handled by parent component
      },
    },
  },
};

export default actionPanelConfig;
