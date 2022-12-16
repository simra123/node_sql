// // Arrow function
// //reduce((previousValue, currentValue) => { /* ... */ } )
// //reduce((previousValue, currentValue, currentIndex) => { /* ... */ } )
// //reduce((previousValue, currentValue, currentIndex, array) => { /* ... */ } )
// //reduce((previousValue, currentValue, currentIndex, array) => { /* ... */ }, initialValue)
// const { captureRejectionSymbol } = require("events");
// const { performance } = require("perf_hooks");
// const array = [3, 5, 6, 3, 7, 7, 8];
// const a = array.reduce((prev, current, index) => {
// 	return prev + current;
// });
// //console.log(a)
// //qucik find max
// let arr = [2, 5, 6, 8, 1, 5, 7];

// //console.log(f[arra.length - 1])

// //find max
// const findMax = (arr) => {
// 	let max = arr[0];
// 	for (let i = 0; i < arr.length; i++) {
// 		if (arr[i] > max) {
// 			max = arr[i];
// 		}
// 	}
// 	return max;
// };
// //console.log(findMax([7, 2, 4, 7, 9, 1, 3, 5, 2, 9, 44, 11, 33, 2, 4, 5]))

// //swaping using temp
// let temp;
// let e = 2;
// let b = 4;
// temp = b;
// b = e;
// e = temp;
// //console.log(e, b)
// //swaping without temp
// let z = 8;
// let f = 2;
// z = z - f; //6
// f = z + f; //8
// z = f - z; //2
// //console.log(z, f)

// //bubble sort
// const sortArr = (arr) => {
// 	for (let i = 0; i < arr.length; i++) {
// 		for (let j = 0; j < arr.length; j++) {
// 			if (arr[j] > arr[j + 1]) {
// 				arr[j] = arr[j] - arr[j + 1];
// 				arr[j + 1] = arr[j] + arr[j + 1];
// 				arr[j] = arr[j + 1] - arr[j];
// 			}
// 		}
// 	}
// 	return arr;
// };
// //console.log(sortArr([7, 2, 4, 7, 9, 1, 3, 5, 2, 9, 44, 11, 33, 2, 4, 5]))

// const sorteArr = (arr) => {
// 	let count = 0;
// 	let swapped;
// 	for (let i = 0; i < arr.length; i++) {
// 		swapped = false;
// 		console.log(i, "p");
// 		for (let j = 0; j < arr.length - i - 1; j++) {
// 			count++;
// 			if (arr[j] > arr[j + 1]) {
// 				arr[j] = arr[j] - arr[j + 1];
// 				arr[j + 1] = arr[j] + arr[j + 1];
// 				arr[j] = arr[j + 1] - arr[j];
// 				swapped = true;
// 			}
// 		}

// 		console.log(arr);
// 		if (!swapped) {
// 			console.log("no swap, array is sorted");
// 			break;
// 		}
// 	}
// 	return arr;
// };

// console.log(sorteArr([1, 3, 4, 6, 9, 6.8]));

// //selection sort
// const selectionSort = (arr) => {
// 	const array = arr.slice(); // to avoid mutable approach ..slice creates a new array
// 	let minIndex;
// 	for (let i = 0; i < array.length - 1; i++) {
// 		minIndex = i; //0 //1 //2 //3 ... length of array
// 		for (let j = i + 1; j < array.length; j++) {
// 			if (array[minIndex] > array[j]) {
// 				minIndex = j;
// 				console.log(`minIndex is ${j} `);
// 			}
// 			//swaping thru arrray destruction
// 			[array[minIndex], array[i]] = [array[i], array[minIndex]];
// 		}
// 	}
// 	return array;
// };
// console.log(selectionSort([5, 3, 4, 2]));

// let names = ["Alice", "Bob", "Bob", "Tiff", "Bruce", "Alice"];

// let countedNames = names.reduce(function (allNames, name) {
// 	if (allNames.indexOf(name) == -1) {
// 		allNames.push(name);
// 	}

// 	return allNames;
// }, []);

// //remove the duplicates
// const c = names.filter((eachNum, index, arr) => arr.indexOf(eachNum) == index);

// //find the missing numbers from 1 to 10 of an array
// const findMissin = (a) => {
// 	let missinList = [];
// 	let c = 0;
// 	for (let i = a[0]; i <= 10; i++) {
// 		if (a[c] == i) {
// 			c++;
// 		} else {
// 			missinList = [...missinList, i];
// 		}
// 	}
// 	return missinList;
// };

// //console.log(findMissin([1, 5, 7, 9]))

// //find single number using math formula
// const singleN = (a) => {
// 	let n = 10;
// 	let total = (n * (n + 1)) / 2;
// 	for (let i = 0; i < a.length; i++) {
// 		total -= a[i];
// 	}
// 	return total;
// };
// //console.log(singleN([1, 2, 3, 4, 5, 7, 8, 9, 10]))

// //Find pair that sums up to k
// const findPair = (arr) => {
// 	const k = 10;
// 	for (let i = 0; i < arr.length; i++) {
// 		for (let j = i; j < arr.length; j++) {
// 			if (arr[i] + arr[j] === k) {
// 				console.log([arr[i], arr[j]]);
// 			}
// 		}
// 	}
// };
// //findPair([4, 5, 6, 7, 3, 7, 534, 53456, 45, 645, 645, 6, 456, 45])

// //find the duplicates
// const findDuplicates = (array) => {
// 	let duplicates = [];
// 	for (let i = 0; i < array.length; i++) {
// 		if (!(array.indexOf(array[i]) == i)) {
// 			duplicates = [...duplicates, array[i]];
// 		}
// 	}
// 	return duplicates;
// };
// //console.log(findDuplicates([3, 5, 6, 3, 7, 7, 8]))

// const reverseS = (str) => {
// 	let newS = "";
// 	for (let i = str.length - 1; i >= 0; i--) {
// 		newS += str[i];
// 	}
// 	return newS;
// };
// console.log(reverseS("hello world"));
// 6, 4, 3, 1, 5;
// const insertionSort = (arr) => {
// 	let temp;
// 	for (let i = 0; i < arr.length; i++) {
// 		let;
// 	}
// };

function quicksort(arr) {
	if (arr.length <= 1) {
		return arr;
	}
	let pivot = arr[0];
	let left = [];
	let right = [];
	for (let i = 1; i < arr.length; i++) {
		if (arr[i] < pivot) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}
	console.log(left, "left", pivot, "pivot", right, "right");

	return quicksort(left).concat(pivot, quicksort(right));
}

//console.log(quicksort([10, 5, 2, 3]));

// def quicksort(array):
//  if len(array) < 2:
//  return array Base case: arrays with 0 or 1 element are already "sorted."
//  else:
//  pivot = array[0] Recursive case
//  less = [i for i in array[1:] if i <= pivot] Sub-array of all the elements
// less than the pivot
//  greater = [i for i in array[1:] if i > pivot] Sub-array of all the elements
// greater than the pivot
//  return quicksort(less) + [pivot] + quicksort(greater)
// print quicksort([10, 5, 2, 3])

const graph = {
	you: ["alice", "bob", "claire"],
	bob: ["anuj", "peggy"],
	alice: ["peggy"],
	claire: ["thom", "jonny"],
	anuj: [],
	peggy: [],
	thom: [],
	jonny: [],
};

const is_persons_seller = (name) => {
	return name[name.length - 1] == "m";
};

const breadthFirst = (map) => {
	let search_queue = map["you"];
};

//for( let i  = 0; i <= search_queue.length ; i++  ){}
