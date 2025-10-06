import React from 'react';

import { CalendarIcon, CheckIcon, ComingUpIcon, DetailIcon, ActionTypeIcon, QuestionIcon, WarningIcon } from '../../../icons';
import AuditDetailIcon from '../../../icons/AuditDetailIcon';
import IncidentIcon from '../../../icons/IncidentIcon';
import RecordIcon from '../../../icons/RecordIcon';
import { PanelConfig } from '../../../interfaces/IPanelConfig';

export const actionPanelConfig: PanelConfig = {
  header: {
    show: true,
    fields: [
      {
        key: 'module_type',
        type: 'custom',
        fallback: 'Unknown Type',
        render: (value: string) => {
          const iconMap = {
            'Incident': IncidentIcon,
            'Record': RecordIcon,
            'default': DetailIcon,
          };
          
          const Icon = iconMap[value as keyof typeof iconMap] || iconMap.default;
          
          return React.createElement('span', {
            style: { 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontSize: '12px',
              color: 'white',
              fontWeight: '600',
            },
          }, [
            React.createElement(Icon),
            value || 'Unknown Type',
          ]);
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
          bg: '#3B82F6',
          color: 'white',
          icon: ComingUpIcon,
          text: 'In Progress',
        },
        'Completed': {
          bg: '#10B981',
          color: 'white',
          icon: CheckIcon,
          text: 'Completed',
        },
        'Pending': {
          bg: '#F59E0B',
          color: 'white',
          icon: WarningIcon,
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
      icon: DetailIcon,
      fallback: 'Unassigned',
    },
    { 
      key: 'action_end_date_timestamp', 
      type: 'date', 
      dateFormat: 'd MMM yyyy',
      icon: CalendarIcon,
      fallback: 'No Due Date',
    },
    { 
      key: 'action_SLA', 
      type: 'text', 
      icon: QuestionIcon,
      fallback: 'No SLA',
    },
    { 
      key: 'action_severity', 
      type: 'badge',
      badgeConfig: {
        variant: 'solid',
        statusConfig: {
          'high': {
            bg: '#EF4444',
            color: 'white',
            text: 'High',
            icon: WarningIcon,
          },
          'medium': {
            bg: '#F59E0B',
            color: 'white',
            text: 'Medium',
            icon: ComingUpIcon,
          },
          'low': {
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
  actions: {
    primary: {
      label: 'View Action',
      icon: AuditDetailIcon,
      onClick: (action: any) => {
        // This will be set by the parent component
        // handled by parent component
      },
    },
    secondary: {
      label: 'Edit Action',
      onClick: (action: any) => {
        // Edit handled by parent component
      },
    },
  },
};
