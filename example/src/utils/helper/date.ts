import { translate } from '@/translations/translate';

const getGreeting = (name: string = '') => {
  /** 00:01-11:59 */
  /** 12:00-16:59 */
  /** 17:00-23:59 */

  const hours = new Date().getHours();

  if (hours >= 0 && hours < 12) {
    return translate('taskify.greetings.goodMorning', { name });
  } else if (hours >= 12 && hours < 18) {
    return translate('taskify.greetings.goodAfternoon', { name });
  } else {
    return translate('taskify.greetings.goodEvening', { name });
  }
};

export { getGreeting };
