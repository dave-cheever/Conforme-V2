import { addDays, addMonths, addWeeks, addYears, differenceInDays } from 'date-fns';

import { useAppContext } from '../contexts/AppProvider';
import { IAudit } from '../interfaces/IAudit';

export const auditStatuses = {
  comingUp: 'Coming up',
  overdue: 'Overdue',
  inProgress: 'In progress',
  completed: 'Completed',
};

export const auditFrequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly', '6 months', 'Annual', '2 years', '3 years', '5 years'];

const useAuditUtils = () => {
  const { settings } = useAppContext();
  const auditsComingUpTriggers = settings.find((el) => el.name === 'auditsComingUpTriggers');

  const getNextDueDate = (dueDate: Date, frequency: string) => {
    let newdueDate;

    switch (frequency) {
      case 'Daily':
        newdueDate = addDays(dueDate, 1);
        break;

      case 'Weekly':
        newdueDate = addWeeks(dueDate, 1);
        break;

      case 'Monthly':
        newdueDate = addMonths(dueDate, 1);
        break;

      case 'Quarterly':
        newdueDate = addMonths(dueDate, 3);
        break;

      case '6 months':
        newdueDate = addMonths(dueDate, 6);
        break;

      case 'Annual':
        newdueDate = addYears(dueDate, 1);
        break;

      case '2 years':
        newdueDate = addYears(dueDate, 2);
        break;

      case '3 years':
        newdueDate = addYears(dueDate, 3);
        break;

      case '5 years':
        newdueDate = addYears(dueDate, 5);
        break;

      default:
        newdueDate = null;
        break;
    }
    return newdueDate;
  };

  const getStatus = (audit: IAudit) => {
    if (!audit) return;

    const { dueDate, status } = audit;
    const daysToDueDate = differenceInDays(new Date(dueDate), new Date());

    if (status === 'completed') return 'completed';

    if (status === 'inProgress' && (!daysToDueDate || daysToDueDate >= 0)) return 'inProgress';

    return 'overdue';
  };

  const isComingUp = (audit: IAudit): Boolean => {
    const { dueDate, status, auditType, walkType } = audit;
    const daysToDueDate = differenceInDays(getNextDueDate(new Date(dueDate), auditType?.frequency!), new Date());
    if (
      status === 'completed' &&
      daysToDueDate !== undefined &&
      daysToDueDate !== null &&
      daysToDueDate >= 0 &&
      auditType?.frequency &&
      daysToDueDate < auditsComingUpTriggers?.value?.[auditType?.frequency] &&
      walkType === 'physical'
    ) {
      // If there is less then or equal comingUpTriggers value and at least 0 days to due date
      return true;
    }
    return false;
  };

  return {
    getNextDueDate,
    getStatus,
    isComingUp,
  };
};

export default useAuditUtils;
