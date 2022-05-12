import { differenceInDays } from 'date-fns';

import { useAppContext } from '../contexts/AppProvider';
import { IAudit } from '../interfaces/IAudit';

export const auditStatuses = {
  completed: 'Completed',
  inProgress: 'In progress',
  comingUp: 'Coming up',
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
  const { settings } = useAppContext();
  const auditsComingUpTriggers = settings.find(
    (el) => el.name === 'auditsComingUpTriggers',
  );

  const getStatus = (audit: IAudit) => {
    if (!audit) return;

    const { dueDate, status } = audit;
    const daysToDueDate = audit.auditType?.startingDate
      ? differenceInDays(
          new Date(dueDate),
          new Date(audit.auditType?.startingDate!),
        )
      : 0;

    if (
      status === 'completed' &&
      daysToDueDate !== undefined &&
      audit.auditType?.frequency &&
      daysToDueDate !== null &&
      daysToDueDate <
        auditsComingUpTriggers?.value?.[audit.auditType?.frequency] &&
      daysToDueDate >= 0
    ) {
      // If there is less then or equal comingUpTriggers value and at least 0 days to due date
      return 'comingUp';
    }

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
