/**
 * @function
 * @name compareDates
 * @param { object } date_1 An instance of the date class.
 * @param { object } date_2 An instance of the date class.
 * @returns { number } -1: if date1 < date2, 1: if date1 > date2, and, 0: if date1 is equal to date2.
 */

const compareDates = (date_1, date_2) => {
  console.log(date_1.valueOf());
  return isFinite(date_1.valueOf()) && isFinite(date_2.valueOf())
    ? (date_1 > date_2) - (date_1 < date_2)
    : NaN;
};

module.exports = compareDates;
