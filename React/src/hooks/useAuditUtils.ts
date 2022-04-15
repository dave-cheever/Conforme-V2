import { differenceInDays } from 'date-fns';

import { IAudit } from '../interfaces/IAudit';

export const auditStatuses = {
  completed: 'Completed',
  inProgress: 'In progress',
  overdue: 'Overdue',
};

export const auditFrequencies = [
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  '6 months',
  'Annual',
  '2 years',
  '3 years',
  '5 years',
];

const useAuditUtils = () => {
  const getRenewalStatus = (audit: IAudit) => {
    if (!audit) return;

    const { dueDate, status } = audit;
    const daysToDueDate = differenceInDays(
      new Date(dueDate),
      new Date(audit.auditType.startingDate),
    );

    if (daysToDueDate && daysToDueDate < 0) {
      // If there is less than 0 days to due date
      return 'overdue';
    }
    // If there is more than comingUpTriggers value days to due date
    // Return one of standard renewal status - "notStarted", "inProgress" or "completed"
    return status;
  };

  const getStatus = (audit: IAudit) => {
    if (!audit) return;

    const { dueDate } = audit;
    const daysToDueDate = differenceInDays(
      new Date(dueDate),
      new Date(audit.auditType.startingDate),
    );

    if (audit.status === 'completed' && (!daysToDueDate || daysToDueDate >= 0))
      return 'completed';

    return 'overdue';
  };

  return {
    getRenewalStatus,
    getStatus,
  };
};

export default useAuditUtils;
