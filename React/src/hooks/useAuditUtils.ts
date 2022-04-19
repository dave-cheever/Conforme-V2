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
  const getStatus = (audit: IAudit) => {
    if (!audit) return;

    const { dueDate } = audit;
    const daysToDueDate = differenceInDays(
      new Date(dueDate),
      new Date(audit.auditType.startingDate),
    );

    if (audit.status === 'completed' && (!daysToDueDate || daysToDueDate >= 0))
      return 'completed';

    if (audit.status === 'inProgress' && (!daysToDueDate || daysToDueDate >= 0))
      return 'inProgress';

    return 'overdue';
  };

  return {
    getStatus,
  };
};

export default useAuditUtils;
