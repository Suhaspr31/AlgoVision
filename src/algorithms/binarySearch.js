/**
 * Binary Search Algorithm Implementation
 * 
 * Time Complexity: O(log n)
 * Space Complexity: O(1) iterative, O(log n) recursive
 * 
 * Requires sorted array - will sort input if not sorted
 */

/**
 * Generate binary search trace
 * @param {number[]} array - Input array (will be sorted if needed)
 * @param {number} target - Target value to search for
 * @returns {Array} Trace array containing each step of the algorithm
 */
export const generateBinarySearch = (array, target) => {
  const trace = [];
  const arr = [...array].sort((a, b) => a - b);
  let low = 0;
  let high = arr.length - 1;

  // Initial state - show sorted array
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: Array.from({ length: arr.length }, (_, k) => k),
    highlight: [],
    low: -1,
    high: -1,
    mid: -1,
    found: -1,
    target: target,
    desc: `Binary Search: Searching for ${target} in sorted array`,
    codeLine: 0
  });

  let steps = 0;
  const maxSteps = 100; // Prevent infinite loops

  while (low <= high && steps < maxSteps) {
    const mid = Math.floor((low + high) / 2);

    // Show current search range
    trace.push({
      array: [...arr],
      compare: [mid],
      swap: [],
      sorted: Array.from({ length: arr.length }, (_, k) => k),
      highlight: Array.from({ length: high - low + 1 }, (_, k) => low + k),
      low: low,
      high: high,
      mid: mid,
      found: -1,
      target: target,
      desc: `Search range: indices [${low}-${high}], checking middle element`,
      codeLine: 1
    });

    // Highlight the middle element being compared
    trace.push({
      array: [...arr],
      compare: [mid],
      swap: [],
      sorted: Array.from({ length: arr.length }, (_, k) => k),
      highlight: [mid],
      low: low,
      high: high,
      mid: mid,
      found: -1,
      target: target,
      desc: `Comparing target ${target} with middle element ${arr[mid]} (index ${mid})`,
      codeLine: 2
    });

    if (arr[mid] === target) {
      // Found the target
      trace.push({
        array: [...arr],
        compare: [],
        swap: [],
        sorted: Array.from({ length: arr.length }, (_, k) => k),
        highlight: [mid],
        low: low,
        high: high,
        mid: mid,
        found: mid,
        target: target,
        desc: `🎉 Found ${target} at index ${mid}!`,
        codeLine: 3
      });
      return trace;
    }

    if (arr[mid] < target) {
      // Target is in the right half
      const oldLow = low;
      low = mid + 1;
      
      trace.push({
        array: [...arr],
        compare: [mid],
        swap: [],
        sorted: Array.from({ length: arr.length }, (_, k) => k),
        highlight: Array.from({ length: high - low + 1 }, (_, k) => low + k),
        low: oldLow,
        high: mid,
        mid: mid,
        found: -1,
        target: target,
        desc: `${arr[mid]} < ${target}, target must be in right half [${low}-${high}]`,
        codeLine: 4
      });
    } else {
      // Target is in the left half
      const oldHigh = high;
      high = mid - 1;
      
      trace.push({
        array: [...arr],
        compare: [mid],
        swap: [],
        sorted: Array.from({ length: arr.length }, (_, k) => k),
        highlight: Array.from({ length: high - low + 1 }, (_, k) => low + k),
        low: low,
        high: oldHigh,
        mid: mid,
        found: -1,
        target: target,
        desc: `${arr[mid]} > ${target}, target must be in left half [${low}-${high}]`,
        codeLine: 5
      });
    }

    steps++;
  }

  // Target not found
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: Array.from({ length: arr.length }, (_, k) => k),
    highlight: [],
    low: -1,
    high: -1,
    mid: -1,
    found: -1,
    target: target,
    desc: `❌ ${target} not found in the array`,
    codeLine: 6
  });

  return trace;
};

/**
 * Pseudocode for display in UI
 */
export const binarySearchPseudocode = [
  "START: Sort the array and initialize pointers",
  "WHILE low <= high:",
  "  mid = (low + high) / 2",
  "  IF arr[mid] == target:",
  "    RETURN mid (found!)",
  "  END IF",
  "  IF arr[mid] < target:",
  "    low = mid + 1",
  "  ELSE:",
  "    high = mid - 1",
  "  END IF",
  "END WHILE",
  "RETURN -1 (not found)"
];

export default generateBinarySearch;
