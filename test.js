// /**
//  * @param {number[]} nums
//  * @return {void} Do not return anything, modify nums in-place instead.
//  */
// var moveZeroes = function (nums) {
//   let fz = 0;
//   let fn = 0;
//   let y = 0;

//   for (let i = 1; i < nums.length; i++) {
//     if (nums[i] == 0 && nums[i - 1] != 0) fz = i;
//     else if (nums[i] != 0) fn = i;
//     if (fn > fz && nums[fz] == 0) {
//       y = nums[fz];
//       nums[fz] = nums[fn];
//       nums[fn] = y;
//       fz = fz + 1;
//     }
//   }
//   return nums;
// };
// console.log(moveZeroes([1, 0, 0, 0, 0, 0, 1]));
function generateRandomSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

console.log(generateRandomSixDigitNumber());
