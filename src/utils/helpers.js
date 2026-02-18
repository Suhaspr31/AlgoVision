/**
 * Utility Functions for AlgoVision
 */

/**
 * Generate a random array of integers
 * @param {number} length - Number of elements
 * @param {number} maxValue - Maximum value for elements
 * @param {number} minValue - Minimum value for elements
 * @returns {number[]} Random array
 */
export const generateRandomArray = (length = 15, maxValue = 100, minValue = 5) => {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
  );
};

/**
 * Check if array is sorted
 * @param {number[]} arr - Array to check
 * @returns {boolean} True if sorted
 */
export const isSorted = (arr) => {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
};

/**
 * Deep clone an array or object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Format number with comma separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Get color based on value (for heatmaps or gradients)
 * @param {number} value - Value to get color for
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {string} HSL color string
 */
export const getValueColor = (value, min = 0, max = 100) => {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const hue = 120 - (normalized * 120); // Green to red
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Delay function for async operations
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Sleep function with minimum duration (useful for animations)
 * @param {number} ms - Minimum milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = async (ms) => {
  await delay(ms);
};

/**
 * Format time complexity for display
 * @param {string} complexity - Complexity string
 * @returns {string} Formatted complexity
 */
export const formatComplexity = (complexity) => {
  const replacements = {
    'O(n²)': 'O(n²)',
    'O(n log n)': 'O(n log n)',
    'O(log n)': 'O(log n)',
    'O(n)': 'O(n)',
    'O(1)': 'O(1)',
    'O(V + E)': 'O(V + E)',
    'O(E log V)': 'O(E log V)',
    '∞': '∞',
  };
  return replacements[complexity] || complexity;
};

/**
 * Get algorithm category
 * @param {string} algorithmId - Algorithm ID
 * @returns {string} Category name
 */
export const getAlgorithmCategory = (algorithmId) => {
  const sorting = ['bubble', 'merge', 'quick'];
  const searching = ['binary'];
  const graphs = ['bfs', 'dfs', 'dijkstra'];
  
  if (sorting.includes(algorithmId)) return 'sorting';
  if (searching.includes(algorithmId)) return 'searching';
  if (graphs.includes(algorithmId)) return 'graphs';
  return 'unknown';
};

/**
 * Get algorithm display name
 * @param {string} algorithmId - Algorithm ID
 * @returns {string} Display name
 */
export const getAlgorithmDisplayName = (algorithmId) => {
  const names = {
    bubble: 'Bubble Sort',
    merge: 'Merge Sort',
    quick: 'Quick Sort',
    binary: 'Binary Search',
    bfs: 'Breadth First Search',
    dfs: 'Depth First Search',
    dijkstra: "Dijkstra's Algorithm",
  };
  return names[algorithmId] || algorithmId;
};

/**
 * Calculate animation duration based on speed setting
 * @param {number} speed - Speed setting (1-10)
 * @returns {number} Duration in milliseconds
 */
export const calculateDuration = (speed) => {
  // Speed 1 = 2000ms, Speed 10 = 50ms
  const maxDuration = 2000;
  const minDuration = 50;
  const range = maxDuration - minDuration;
  const factor = (10 - speed) / 9;
  return Math.round(minDuration + (range * factor));
};

export default {
  generateRandomArray,
  isSorted,
  deepClone,
  formatNumber,
  getValueColor,
  delay,
  sleep,
  formatComplexity,
  getAlgorithmCategory,
  getAlgorithmDisplayName,
  calculateDuration,
};
