import React from 'react';

import {
  Building,
  CheckIcon,
  ComingUpIcon,
  DetailIcon,
  EditIncidentIcon,
  EscalatedStatusIcon,
  HospitalIcon,
  IncidentTimestampIcon,
  InvestigationStatusIcon,
  LinkedIncidentIcon,
  PeopleAssignedIcon,
  WardLocationIcon,
  WarningIcon,
} from '../../../icons';
import AuditDetailIcon from '../../../icons/AuditDetailIcon';
import { PanelConfig } from '../../../interfaces/IPanelConfig';
import LinkedIncidentRenderer from '../LinkedIncidentRenderer';

const incidentPanelConfig: PanelConfig = {
  header: {
    show: false,
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
            [React.createElement(Building, { key: 'building-icon' }), value || 'Unknown Hospital'],
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
        'inReview': {
          bg: '#F97316',
          color: 'white',
          icon: EditIncidentIcon,
          text: 'inReview',
        },
        Investigation: {
          bg: '#0073E6',
          color: 'white',
          icon: InvestigationStatusIcon,
          text: 'Investigation',
        },
        Escalated: {
          bg: '#D0021B',
          color: 'white',
          icon: EscalatedStatusIcon,
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
  description: {
    key: 'description',
    type: 'text',
    fallback: 'No Description',
  },
  details: [
    {
      key: 'owner',
      type: 'user',
      fallback: 'Unassigned',
    },
    {
      key: 'hospital_name',
      type: 'text',
      icon: HospitalIcon,
      fallback: 'No Hospital',
    },
    {
      key: 'ward_location',
      type: 'text',
      icon: WardLocationIcon,
      fallback: 'No Location',
    },
    {
      key: 'people_assigned',
      type: 'text',
      icon: PeopleAssignedIcon,
      fallback: 'No one assigned',
      textStyle: {
        color: '#2D3748',
        fontSize: '12px',
        fontWeight: 600,
      },
      render: (value: any) => {
        let text = 'No one assigned';

        if (value) {
          if (Array.isArray(value)) {
            if (value.length === 0) text = 'No one assigned';
            else if (value.length === 1) text = value[0];
            else text = `${value.length} people`;
          } else text = value;
        }

        return React.createElement(
          'span',
          {
            style: {
              color: '#2D3748',
              fontSize: '12px',
              fontWeight: 600,
            },
          },
          text,
        );
      },
    },
    {
      key: 'timestamp',
      type: 'date',
      dateFormat: 'd MMM yyyy, h:mm a',
      icon: IncidentTimestampIcon,
      fallback: 'No Date',
    },
    {
      key: 'criticality_level',
      type: 'text',
      fallback: 'Unknown',
    },
  ],
  linkedItem: {
    show: true,
    fieldKey: 'linked_item',
    label: 'Linked Action',
    icon: LinkedIncidentIcon,
    render: (value: any) => {
      if (!value) return null;
      return React.createElement(LinkedIncidentRenderer, { value: String(value) });
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
    secondaryActions: [
      {
        label: 'Edit Incident',
        icon: DetailIcon,
        onClick: () => {
          // Edit incident action
        },
      },
      {
        label: 'Assign to Me',
        icon: PeopleAssignedIcon,
        onClick: () => {
          // Assign to me action
        },
      },
      {
        label: 'Close Incident',
        icon: CheckIcon,
        onClick: () => {
          // Close incident action
        },
      },
    ],
  },
};

export default incidentPanelConfig;
