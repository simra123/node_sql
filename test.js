// const bubbleSort = (arr) => {
//     for (let i = 0; i < arr.length; i++) {
//         for (let j = 0; j < arr.length; j++) {
//             if (arr[j] > arr[j + 1]) {
//                 [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
//             }
//         }
//     }
//     return arr
// }
// console.log(bubbleSort([10, 3, 7, 9, 20, 46, 2, 1]))

// //reverse string
// const reverse = (str) => {
//     let newS = ""
//     for (let i = str.length - 1; i >= 0; i--) {
//         newS += str[i]
//     }
//     return newS
// }

// console.log(reverse('hello world'))

// array = [2, 5, 7, 3, 7, 30]

// const a = array.reduce((initial, current) => {
//     return initial + current
// }, 0)
// console.log(a)

// //seleton sort
// //2, 3, 4, 7, 5
// const seletonSort = (arr) => {
//     let minIndex
//     for (let i = 0; i < arr.length - 1; i++) {
//         minIndex = i //0 , 1
//         for (let j = i + 1; j < arr.length; j++) {
//             if (arr[minIndex] > arr[j]) { // 3 > 2
//                 minIndex = j
//             }
//             [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]]
//         }
//     }
//     return arr
// }
// console.log(seletonSort([2, 5, 7, 342, 78, 76, 3, 2, 1, -7, 2, -6666]))
