import { CheckIcon, ComingUpIcon, WarningIcon } from '../../../icons';
import AuditDetailIcon from '../../../icons/AuditDetailIcon';
import { PanelConfig } from '../../../interfaces/IPanelConfig';

const trackerPanelConfig: PanelConfig = {
  title: {
    primary: {
      key: 'trackerItem.name',
      type: 'text',
      fallback: 'No Name',
    },
    secondary: {
      key: 'trackerItem.category.name',
      type: 'text',
      fallback: 'No Category',
    },
  },
  status: {
    key: 'calculatedStatus',
    type: 'badge',
    badgeConfig: {
      variant: 'solid',
      statusConfig: {
        compliant: {
          bg: '#10B981',
          color: 'white',
          icon: CheckIcon,
          text: 'Compliant',
        },
        nonCompliant: {
          bg: '#EF4444',
          color: 'white',
          icon: WarningIcon,
          text: 'Non-Compliant',
        },
        comingUp: {
          bg: '#F59E0B',
          color: 'white',
          icon: ComingUpIcon,
          text: 'Coming Up',
        },
      },
    },
    fallback: 'Unknown',
  },
  details: [
    {
      key: 'businessUnit.name',
      type: 'text',
      label: 'Business Unit',
      fallback: 'No Business Unit',
    },
    {
      key: 'dueDate',
      type: 'date',
      dateFormat: 'd MMM yyyy',
      fallback: 'No Due Date',
    },
    {
      key: 'responsible.displayName',
      type: 'user',
      label: 'Responsible',
      fallback: 'Unassigned',
    },
  ],
  actions: {
    primary: {
      label: 'View Response',
      icon: AuditDetailIcon,
      onClick: () => {
        // This will be set by the parent component
        // Navigate handled by parent component
      },
    },
    panelClick: {
      onClick: () => {
        // This will be set by the parent component
        // Navigate to detail page handled by parent component
      },
    },
    secondary: {
      label: 'Edit Response',
      onClick: () => {
        // Edit handled by parent component
      },
    },
  },
};

export default trackerPanelConfig;
