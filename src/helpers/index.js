/**
 * checks if string is undefined or equals to false
 * @param string
 * @returns {boolean}
 */
export const stringToBool = (string) => {
  return typeof string !== "undefined" && string !== "false";
};

/**
 * swaps two elements in array
 * @param array
 * @param index1
 * @param index2
 * @returns {*}
 */
export const swapElements = (array, index1, index2) => {
  array = array.slice();
  [array[index1], array[index2]] = [array[index2], array[index1]];
  return array;
};
