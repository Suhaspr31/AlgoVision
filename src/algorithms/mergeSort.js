/**
 * Merge Sort Algorithm Implementation
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 * 
 * Uses divide and conquer strategy
 */

/**
 * Generate merge sort trace
 * @param {number[]} array - Input array to sort
 * @returns {Array} Trace array containing each step of the algorithm
 */
export const generateMergeSort = (array) => {
  const trace = [];
  const arr = [...array];

  /**
   * Helper function to merge two sorted subarrays
   * @param {number[]} arr - The array being sorted
   * @param {number} start - Start index of first subarray
   * @param {number} mid - End index of first subarray
   * @param {number} end - End index of second subarray
   */
  const merge = (start, mid, end) => {
    const leftArr = arr.slice(start, mid + 1);
    const rightArr = arr.slice(mid + 1, end + 1);
    
    let i = 0, j = 0, k = start;
    const merged = [];

    // Highlight the two subarrays being merged
    trace.push({
      array: [...arr],
      compare: [],
      swap: [],
      sorted: [],
      highlight: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
      range: [start, end],
      desc: `Merging sorted subarrays [${start}-${mid}] and [${mid+1}-${end}]`,
      codeLine: 1
    });

    while (i < leftArr.length && j < rightArr.length) {
      // Compare elements from both subarrays
      trace.push({
        array: [...arr],
        compare: [start + i, mid + 1 + j],
        swap: [],
        sorted: [],
        highlight: [start + i, mid + 1 + j],
        desc: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        codeLine: 2
      });

      if (leftArr[i] <= rightArr[j]) {
        merged.push(leftArr[i]);
        arr[k] = leftArr[i];
        i++;
      } else {
        merged.push(rightArr[j]);
        arr[k] = rightArr[j];
        j++;
      }
      k++;

      // Show state after placing element
      trace.push({
        array: [...arr],
        compare: [],
        swap: [k - 1],
        sorted: merged.map((val, idx) => start + idx),
        highlight: [k - 1],
        desc: `Placed ${arr[k - 1]} in position ${k - 1}`,
        codeLine: 3
      });
    }

    // Copy remaining elements from left subarray
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      merged.push(leftArr[i]);
      i++;
      k++;
      trace.push({
        array: [...arr],
        compare: [],
        swap: [k - 1],
        sorted: merged.map((val, idx) => start + idx),
        highlight: [k - 1],
        desc: `Copying remaining ${arr[k - 1]} from left subarray`,
        codeLine: 4
      });
    }

    // Copy remaining elements from right subarray
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      merged.push(rightArr[j]);
      j++;
      k++;
      trace.push({
        array: [...arr],
        compare: [],
        swap: [k - 1],
        sorted: merged.map((val, idx) => start + idx),
        highlight: [k - 1],
        desc: `Copying remaining ${arr[k - 1]} from right subarray`,
        codeLine: 5
      });
    }
  };

  /**
   * Recursive function to divide the array
   * @param {number[]} arr - Array to sort
   * @param {number} start - Start index
   * @param {number} end - End index
   */
  const divide = (start, end) => {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      
      // Recursively divide left half
      trace.push({
        array: [...arr],
        compare: [],
        swap: [],
        sorted: [],
        highlight: [start, mid],
        range: [start, mid],
        desc: `Dividing left half: [${start}-${mid}]`,
        codeLine: 6
      });
      divide(start, mid);

      // Recursively divide right half
      trace.push({
        array: [...arr],
        compare: [],
        swap: [],
        sorted: [],
        highlight: [mid + 1, end],
        range: [mid + 1, end],
        desc: `Dividing right half: [${mid+1}-${end}]`,
        codeLine: 7
      });
      divide(mid + 1, end);

      // Merge the sorted halves
      merge(start, mid, end);
    }
  };

  // Initial state
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: [],
    highlight: [],
    desc: "Starting Merge Sort Algorithm",
    codeLine: 0
  });

  // Start the sorting process
  divide(0, arr.length - 1);

  // Final state - All elements sorted
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: Array.from({ length: arr.length }, (_, k) => k),
    highlight: [],
    desc: "Merge Sort Complete! Array is now sorted.",
    codeLine: 8
  });

  return trace;
};

/**
 * Pseudocode for display in UI
 */
export const mergeSortPseudocode = [
  "START: Create a copy of the input array",
  "FUNCTION mergeSort(start, end):",
  "  IF start < end:",
  "    mid = (start + end) / 2",
  "    mergeSort(start, mid)",
  "    mergeSort(mid + 1, end)",
  "    merge(start, mid, end)",
  "  END IF",
  "END FUNCTION",
  "FUNCTION merge(start, mid, end):",
  "  Merge two sorted subarrays",
  "  Copy elements back to original array",
  "END FUNCTION",
  "END: Array is sorted"
];

export default generateMergeSort;
