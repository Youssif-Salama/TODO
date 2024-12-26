/**
 * Generates a random OTP of specified digits.
 * @param {number} digitsNo - The number of digits in the OTP
 * @returns {number} A random OTP of the specified number of digits
 */
export const GenerateOTP = (digitsNo) => {
  return Math.floor(10 ** (digitsNo - 1) + Math.random() * 9 * 10 ** (digitsNo - 1));
};
