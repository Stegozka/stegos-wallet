import { RECOVERY_PHRASE_LENGTH } from '../constants/config';
import { Account } from '../reducers/types';

export const toTwoDigits = (str: string) => `0${str}`.slice(-2);

export const to101Date = (date: Date) =>
  `${toTwoDigits(date.getMonth() + 1)}/${toTwoDigits(
    date.getDate()
  )}/${date.getFullYear()}`;

export const to108Time = (date: Date) =>
  `${toTwoDigits(date.getHours())}:${toTwoDigits(
    date.getMinutes()
  )}:${date.getSeconds()}`;

export const getCertificateVerificationDate = date =>
  `${to101Date(date)} ${to108Time(date)}`;

export const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{50,51}$/;
export const BECH32_REGEX = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;

export const isBase58 = str => BASE58_REGEX.test(str);

export const isBech32 = str => BECH32_REGEX.test(str);

export const isStegosNumber = str => /^-?\d+\.?\d{0,6}$/.test(str); // todo use STG_DIVISIBILITY

export const isPositiveStegosNumber = str => /^\d+\.?\d{0,6}$/.test(str); // todo use STG_DIVISIBILITY

export const DIGIT_NUMBER_FORMAT = /\B(?=(\d{3})+(?!\d))/g;

export const formatDigit = (value: number | string) => {
  const parts = value.toString().split('.');
  parts[0] = parts[0].replace(DIGIT_NUMBER_FORMAT, ',');
  return parts.join('.');
};

export const POSITIVE_NUMBER_FORMAT = /^(\d+)(\.\d+)?$/;

export const isPositiveNumber = str => POSITIVE_NUMBER_FORMAT.test(str);

export const getEmptyRecoveryPhrase = () => {
  const words = [];
  for (let i = 0; i < RECOVERY_PHRASE_LENGTH; i += 1) {
    words.push({ id: i, value: '' });
  }
  return words;
};

export const formatDateForWs = ts => {
  const date = new Date(ts);
  return (
    `${date.getFullYear()}-${toTwoDigits(date.getMonth() + 1)}-${toTwoDigits(
      date.getDate()
    )}` +
    `T${toTwoDigits(date.getHours())}:${toTwoDigits(
      date.getMinutes()
    )}:${toTwoDigits(date.getSeconds())}.000000000Z`
  );
};

export const getYearAgoTimestamp = () => {
  const now = new Date();
  return now.setFullYear(now.getFullYear() - 1);
};

export const getAccountName = (account: Account, intl: any) => {
  // todo
  if (account.name) {
    return account.name;
  }
  return intl.formatMessage(
    { id: `account.default.${account.isRestored ? 'restored.' : ''}name` },
    { id: account.id }
  );
};
