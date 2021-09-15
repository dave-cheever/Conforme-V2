import { useContext } from 'react';
import moment from 'moment';
import { isInteger } from "lodash";

import { IStore, store } from '../bootstrap/store';
import { IResponse } from '../interfaces/IResponse';
import { getUTCDate } from "../utils/helpers";

const useResponseUtils = () => {
  const { state }: IStore = useContext(store);
  const comingUpTriggers = state.settings.find(
    (el) => el.name === 'comingUpTriggers'
  );

  const getRenewalStatus = (response: IResponse) => {
    const { daysToDueDate, status } = response;
    if (status === 'completed' && daysToDueDate && response.frequency && daysToDueDate !== null && daysToDueDate <= comingUpTriggers?.value?.[response.frequency] && daysToDueDate >= 0) {
      // If there is less then or equal comingUpTriggers value and at least 0 days to due date
      return 'comingUp';
    } else if (daysToDueDate && daysToDueDate < 0) {
      // If there is less than 0 days to due date
      return 'overdue';
    }
    // If there is more than comingUpTriggers value days to due date
    // Return one of standard renewal status - "notStarted", "inProgress" or "completed"
    return status;
  };

  const getRenewalStatusText = (response: IResponse) => {
    const renewalStatus = getRenewalStatus(response);
    const { daysToDueDate } = response;
    switch (renewalStatus) {
      case 'notStarted':
        return 'Not started';
      case 'inProgress':
        switch (true) {
          case (daysToDueDate && daysToDueDate < -1):
            return `Due ${daysToDueDate && (daysToDueDate * -1)} days ago`;
          case (daysToDueDate === -1):
            return 'Due yesterday';
          case (daysToDueDate === 0):
            return 'Due today';
          case (daysToDueDate === 1):
            return 'Due tomorrow';
          case (daysToDueDate === null):
            return 'No due date';
          default:
            return `Due in ${daysToDueDate} days`;
        }
      case 'completed':
        const daysToNextRenewal = moment().startOf('day').diff(moment(response.nextRenewalDate).startOf('day'), 'days') * -1;
        if (isInteger(daysToNextRenewal)) {
          return `Next due in ${daysToNextRenewal} days`;
        }
        return `Completed`;
      case 'comingUp':
        if (daysToDueDate === 0) {
          return `Due today`;
        }
        if (daysToDueDate === 1) {
          return `Due tomorrow`;
        }
        return `Due in ${daysToDueDate} days`;
      case 'overdue':
        if (daysToDueDate === -1) {
          return `Due yesterday`;
        }
        return `Due ${daysToDueDate && (daysToDueDate * -1)} days ago`;
    }
  };

  const getStatus = (response: IResponse) => {
    if (response.status === 'completed' && (!response.daysToDueDate || response.daysToDueDate >= 0)) {
      // If status is "completed" and (there is no due date or response is not overdue)
      return 'compliant';
    }
    return 'nonCompliant';
  };

  const getNextRenewalDate = (response: IResponse) => {
    const { frequency, nextRenewalDate } = response;
    const nextRenewalDateUTC = getUTCDate(nextRenewalDate);
    let newNextRenewalDate;
    switch (frequency) {
      case "Monthly":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.add(1, 'month') : getUTCDate().add(1, 'month');
        break;
  
      case "Quarterly":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.add(3, 'months') : getUTCDate().add(3, 'months');
        break;
  
      case "6 months":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.add(6, 'months') : getUTCDate().add(6, 'months');
        break;
  
      case "Annual":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.add(1, 'year') : getUTCDate().add(1, 'year');
        break;
  
      case "2 years":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.add(2, 'years') : getUTCDate().add(2, 'years');
        break;
  
      case "5 years":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.add(5, 'years') : getUTCDate().add(5, 'years');
        break;
  
      default:
        newNextRenewalDate = null;
        break;
    }
    return newNextRenewalDate;
  };

  const getPrevRenewalDate = (response: IResponse) => {
    const { frequency, nextRenewalDate } = response;
    const nextRenewalDateUTC = getUTCDate(nextRenewalDate);
    let newNextRenewalDate;
    switch (frequency) {
      case "Monthly":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.subtract(1, 'month') : getUTCDate().subtract(1, 'month');
        break;
  
      case "Quarterly":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.subtract(3, 'months') : getUTCDate().subtract(3, 'months');
        break;
  
      case "6 months":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.subtract(6, 'months') : getUTCDate().subtract(6, 'months');
        break;
  
      case "Annual":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.subtract(1, 'year') : getUTCDate().subtract(1, 'year');
        break;
  
      case "2 years":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.subtract(2, 'years') : getUTCDate().subtract(2, 'years');
        break;
  
      case "5 years":
        newNextRenewalDate = nextRenewalDate ? nextRenewalDateUTC.subtract(5, 'years') : getUTCDate().subtract(5, 'years');
        break;
  
      default:
        newNextRenewalDate = null;
        break;
    }
    return newNextRenewalDate;
  };

  return { getRenewalStatus, getRenewalStatusText, getStatus, getNextRenewalDate, getPrevRenewalDate };
};

export default useResponseUtils;
