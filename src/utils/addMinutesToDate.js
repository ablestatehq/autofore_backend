const addMinutesToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};
module.exports = addMinutesToDate;
