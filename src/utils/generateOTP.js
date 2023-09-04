/**
 * @function
 * @name generateOTP
 * @returns {Number} A six digit random code
 */

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
module.exports = generateOTP;
