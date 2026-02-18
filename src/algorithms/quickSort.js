/**
 * Quick Sort Algorithm Implementation
 * 
 * Time Complexity: O(n log n) average, O(n²) worst case
 * Space Complexity: O(log n) for recursion stack
 * 
 * Uses partition-based divide and conquer strategy
 */

/**
 * Generate quick sort trace
 * @param {number[]} array - Input array to sort
 * @returns {Array} Trace array containing each step of the algorithm
 */
export const generateQuickSort = (array) => {
  const trace = [];
  const arr = [...array];

  /**
   * Partition function that places pivot in correct position
   * @param {number[]} arr - Array to partition
   * @param {number} low - Low index
   * @param {number} high - High index (pivot)
   * @returns {number} Final position of pivot
   */
  const partition = (low, high) => {
    const pivot = arr[high];
    let i = low - 1;

    // Highlight pivot
    trace.push({
      array: [...arr],
      compare: [],
      swap: [],
      sorted: [],
      highlight: [high],
      pivot: high,
      desc: `Selecting ${pivot} as pivot (last element)`,
      codeLine: 1
    });

    for (let j = low; j < high; j++) {
      // Compare current element with pivot
      trace.push({
        array: [...arr],
        compare: [j, high],
        swap: [],
        sorted: [],
        highlight: [j, high],
        pivot: high,
        desc: `Comparing ${arr[j]} with pivot ${pivot}`,
        codeLine: 2
      });

      if (arr[j] < pivot) {
        i++;
        // Swap elements
        [arr[i], arr[j]] = [arr[j], arr[i]];
        
        trace.push({
          array: [...arr],
          compare: [i, j],
          swap: [i, j],
          sorted: [],
          highlight: [i, j],
          pivot: high,
          desc: `${arr[i]} < ${pivot}, swapping ${arr[i]} to position ${i}`,
          codeLine: 3
        });
      }
    }

    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    trace.push({
      array: [...arr],
      compare: [],
      swap: [i + 1, high],
      sorted: [],
      highlight: [i + 1],
      pivot: i + 1,
      desc: `Placed pivot ${pivot} at position ${i + 1}`,
      codeLine: 4
    });

    return i + 1;
  };

  /**
   * Recursive quick sort function
   * @param {number[]} arr - Array to sort
   * @param {number} low - Low index
   * @param {number} high - High index
   */
  const quickSort = (low, high) => {
    if (low < high) {
      // Partition the array
      const pi = partition(low, high);

      // Highlight sorted pivot
      trace.push({
        array: [...arr],
        compare: [],
        swap: [],
        sorted: [pi],
        highlight: [pi],
        pivot: pi,
        desc: `Pivot ${arr[pi]} is now in its correct position`,
        codeLine: 5
      });

      // Recursively sort left and right subarrays
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  // Initial state
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: [],
    highlight: [],
    desc: "Starting Quick Sort Algorithm",
    codeLine: 0
  });

  // Start the sorting process
  quickSort(0, arr.length - 1);

  // Final state - All elements sorted
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: Array.from({ length: arr.length }, (_, k) => k),
    highlight: [],
    desc: "Quick Sort Complete! Array is now sorted.",
    codeLine: 6
  });

  return trace;
};

/**
 * Pseudocode for display in UI
 */
export const quickSortPseudocode = [
  "START: Create a copy of the input array",
  "FUNCTION quickSort(low, high):",
  "  IF low < high:",
  "    pivotIndex = partition(low, high)",
  "    quickSort(low, pivotIndex - 1)",
  "    quickSort(pivotIndex + 1, high)",
  "  END IF",
  "END FUNCTION",
  "FUNCTION partition(low, high):",
  "  pivot = arr[high]",
  "  i = low - 1",
  "  FOR j from low to high-1:",
  "    IF arr[j] < pivot:",
  "      i++",
  "      SWAP arr[i] and arr[j]",
  "    END IF",
  "  END FOR",
  "  SWAP arr[i+1] and arr[high]",
  "  RETURN i + 1",
  "END FUNCTION",
  "END: Array is sorted"
];

export default generateQuickSort;
