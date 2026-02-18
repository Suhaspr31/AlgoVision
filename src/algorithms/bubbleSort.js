/**
 * Bubble Sort Algorithm Implementation
 * 
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 * 
 * Generates a trace of all steps for visualization
 */

/**
 * Generate bubble sort trace
 * @param {number[]} array - Input array to sort
 * @returns {Array} Trace array containing each step of the algorithm
 */
export const generateBubbleSort = (array) => {
  const trace = [];
  const arr = [...array];
  const n = arr.length;

  // Initial State
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: [],
    highlight: [],
    desc: "Starting Bubble Sort Algorithm",
    codeLine: 0
  });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison Step
      trace.push({
        array: [...arr],
        compare: [j, j + 1],
        swap: [],
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
        highlight: [j, j + 1],
        desc: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        codeLine: 1
      });

      if (arr[j] > arr[j + 1]) {
        // Swap Step
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        trace.push({
          array: [...arr],
          compare: [j, j + 1],
          swap: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          highlight: [j, j + 1],
          desc: `Swapping ${arr[j]} and ${arr[j + 1]} - ${arr[j]} > ${arr[j + 1]}`,
          codeLine: 2
        });
      }
    }
    // Mark element as sorted
    trace.push({
      array: [...arr],
      compare: [],
      swap: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      highlight: [n - 1 - i],
      desc: `Element ${arr[n - 1 - i]} is now in its correct position`,
      codeLine: 3
    });
  }

  // Final State - All elements sorted
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    highlight: [],
    desc: "Bubble Sort Complete! Array is now sorted.",
    codeLine: 4
  });

  return trace;
};

/**
 * Pseudocode for display in UI
 */
export const bubbleSortPseudocode = [
  "START: Create a copy of the input array",
  "FOR i from 0 to n-1:",
  "  FOR j from 0 to n-i-2:",
  "    IF array[j] > array[j+1]:",
  "      SWAP array[j] and array[j+1]",
  "    END IF",
  "  END FOR",
  "END FOR",
  "END: Array is sorted"
];

export default generateBubbleSort;
