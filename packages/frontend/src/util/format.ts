import format from 'date-fns/format';

export const formatCalories = (value: number, round?: boolean): string =>
  value ? `${value.toFixed(round ? 0 : 2)}${round ? '' : ' '}kcal` : '';

export const formatTime = (dateString: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(`${dateString}`)) {
    return '';
  }

  return format(new Date(dateString), 'hh:mm aaa');
};

export const formatDay = (dateString: string, isLong?: boolean): string => {
  if (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(`${dateString}`)) {
    return '';
  }

  const date = new Date(dateString);

  const [, month, day] = dateString
    .replace(/T.*/, '')
    .split('-')
    .map(x => +x);

  const dateFormat = isLong
    ? 'eeee, do LLLL'
    : day > 1
    ? 'eee do'
    : month > 1
    ? 'LLL'
    : 'yyyy';

  return format(date, dateFormat);
};
