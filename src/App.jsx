import React, { useState, useMemo, useEffect } from 'react';
import { Moon, Sun, Cpu, Github, Menu, X, RotateCcw, Shuffle, BarChart2, GitBranch, Search } from 'lucide-react';
import Controls from './components/Controls';
import SortingBoard from './components/SortingBoard';
import GraphBoard from './components/GraphBoard';
import Navbar from './components/Navbar';
import PseudocodePanel from './components/PseudocodePanel';
import { useAlgoPlayer } from './hooks/useAlgoPlayer';

// Algorithm generators
import { generateBubbleSort, bubbleSortPseudocode } from './algorithms/bubbleSort';
import { generateMergeSort, mergeSortPseudocode } from './algorithms/mergeSort';
import { generateQuickSort, quickSortPseudocode } from './algorithms/quickSort';
import { generateBinarySearch, binarySearchPseudocode } from './algorithms/binarySearch';
import { generateBFS, generateDFS, generateDijkstra, generatePrim, generateKruskal, generateBellmanFord, generateFloydWarshall, bfsPseudocode, dfsPseudocode, dijkstraPseudocode, primPseudocode, kruskalPseudocode, bellmanFordPseudocode, floydWarshallPseudocode, createDefaultGraph } from './algorithms/graphAlgorithms';

/**
 * Helper function to generate random array
 */
const generateRandomArray = (length = 15, maxValue = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * maxValue) + 5);
};

/**
 * Algorithm categories
 */
const ALGORITHM_CATEGORIES = {
  sorting: [
    { id: 'bubble', name: 'Bubble Sort', icon: BarChart2, type: 'sorting' },
    { id: 'merge', name: 'Merge Sort', icon: BarChart2, type: 'sorting' },
    { id: 'quick', name: 'Quick Sort', icon: BarChart2, type: 'sorting' },
  ],
  searching: [
    { id: 'binary', name: 'Binary Search', icon: Search, type: 'searching' },
  ],
  graphs: [
    { id: 'bfs', name: 'BFS', icon: GitBranch, type: 'graph' },
    { id: 'dfs', name: 'DFS', icon: GitBranch, type: 'graph' },
    { id: 'dijkstra', name: "Dijkstra's", icon: GitBranch, type: 'graph' },
    { id: 'bellman', name: 'Bellman-Ford', icon: GitBranch, type: 'graph' },
    { id: 'floyd', name: 'Floyd-Warshall', icon: GitBranch, type: 'graph' },
    { id: 'prim', name: "Prim's", icon: GitBranch, type: 'graph' },
    { id: 'kruskal', name: "Kruskal's", icon: GitBranch, type: 'graph' },
  ]
};

/**
 * Main App Component
 */
function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(true);
  
  // Algorithm selection
  const [selectedCategory, setSelectedCategory] = useState('sorting');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  
  // Data state
  const [array, setArray] = useState(() => generateRandomArray(15));
  const [searchTarget, setSearchTarget] = useState(40);
  const [arraySize, setArraySize] = useState(15);
  
  // Graph state
  const [graph, setGraph] = useState(createDefaultGraph);
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode] = useState(5);
  
  // Speed control
  const [speed, setSpeed] = useState(250);
  
  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initialize graph trace on mount or when graph algorithm is selected
  useEffect(() => {
    if (selectedCategory === 'graphs' && trace.length === 0) {
      // Force regeneration of graph trace
      let newGraph = createDefaultGraph();
      if (selectedAlgorithm === 'bfs') {
        newGraph = generateBFS(newGraph, startNode);
      } else if (selectedAlgorithm === 'dfs') {
        newGraph = generateDFS(newGraph, startNode);
      } else if (selectedAlgorithm === 'dijkstra') {
        newGraph = generateDijkstra(newGraph, startNode, endNode);
      }
    }
  }, [selectedCategory, selectedAlgorithm]);

  // Generate trace based on selected algorithm
  const trace = useMemo(() => {
    if (selectedCategory === 'graphs') {
      if (selectedAlgorithm === 'bfs') {
        return generateBFS(graph, startNode);
      } else if (selectedAlgorithm === 'dfs') {
        return generateDFS(graph, startNode);
      } else if (selectedAlgorithm === 'dijkstra') {
        return generateDijkstra(graph, startNode, endNode);
      } else if (selectedAlgorithm === 'bellman') {
        return generateBellmanFord(graph, startNode);
      } else if (selectedAlgorithm === 'floyd') {
        return generateFloydWarshall(graph);
      } else if (selectedAlgorithm === 'prim') {
        return generatePrim(graph);
      } else if (selectedAlgorithm === 'kruskal') {
        return generateKruskal(graph);
      }
    } else if (selectedCategory === 'searching') {
      return generateBinarySearch(array, searchTarget);
    } else {
      // Sorting algorithms
      if (selectedAlgorithm === 'bubble') {
        return generateBubbleSort(array);
      } else if (selectedAlgorithm === 'merge') {
        return generateMergeSort(array);
      } else if (selectedAlgorithm === 'quick') {
        return generateQuickSort(array);
      }
    }
    return [];
  }, [selectedAlgorithm, selectedCategory, array, searchTarget, graph, startNode, endNode]);

  // Get pseudocode based on algorithm
  const pseudocode = useMemo(() => {
    switch (selectedAlgorithm) {
      case 'bubble': return bubbleSortPseudocode;
      case 'merge': return mergeSortPseudocode;
      case 'quick': return quickSortPseudocode;
      case 'binary': return binarySearchPseudocode;
      case 'bfs': return bfsPseudocode;
      case 'dfs': return dfsPseudocode;
      case 'dijkstra': return dijkstraPseudocode;
      case 'bellman': return bellmanFordPseudocode;
      case 'floyd': return floydWarshallPseudocode;
      case 'prim': return primPseudocode;
      case 'kruskal': return kruskalPseudocode;
      default: return [];
    }
  }, [selectedAlgorithm]);

  // Initialize player hook
  const { step, isPlaying, togglePlay, reset, next, prev, jumpTo, totalSteps, progress } = useAlgoPlayer(trace, speed);

  // Current trace state - with fallback for graph visualization
  const currentState = trace[step] || {
    ...(selectedCategory === 'graphs' ? { graph: createDefaultGraph(), desc: 'Graph ready - Press play to start' } : {})
  };

  /**
   * Handle array regeneration
   */
  const regenerateArray = () => {
    setArray(generateRandomArray(arraySize));
    reset();
  };

  /**
   * Handle algorithm change
   */
  const handleAlgorithmChange = (category, algorithmId) => {
    setSelectedCategory(category);
    setSelectedAlgorithm(algorithmId);
    reset();
  };

  /**
   * Get visualization type
   */
  const getVisualizationType = () => {
    if (selectedCategory === 'graphs') return 'graph';
    if (selectedCategory === 'searching') return 'binary';
    return 'sorting';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Algorithm Selection Panel */}
        <div className="card p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Category Tabs */}
            <div className="flex lg:flex-col gap-2">
              {Object.entries(ALGORITHM_CATEGORIES).map(([category, algorithms]) => (
                <button
                  key={category}
                  onClick={() => handleAlgorithmChange(category, algorithms[0].id)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all
                    ${selectedCategory === category 
                      ? 'bg-primary text-white shadow-lg shadow-indigo-500/30' 
                      : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Algorithm Buttons */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {ALGORITHM_CATEGORIES[selectedCategory]?.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => {
                      setSelectedAlgorithm(algo.id);
                      reset();
                    }}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all flex items-center gap-2
                      ${selectedAlgorithm === algo.id 
                        ? 'bg-primary text-white shadow-lg shadow-indigo-500/30' 
                        : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
                      }
                    `}
                  >
                    <algo.icon size={16} />
                    {algo.name}
                  </button>
                ))}
              </div>

              {/* Category-specific Controls */}
              {selectedCategory === 'sorting' && (
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Array Size</label>
                    <input 
                      type="range" 
                      min="5" 
                      max="30" 
                      value={arraySize}
                      onChange={(e) => {
                        setArraySize(Number(e.target.value));
                        setArray(generateRandomArray(Number(e.target.value)));
                      }}
                      className="w-32"
                    />
                    <span className="text-xs ml-2">{arraySize}</span>
                  </div>
                  <button 
                    onClick={regenerateArray}
                    className="btn btn-secondary"
                  >
                    <Shuffle size={16} />
                    Randomize
                  </button>
                  <button 
                    onClick={() => setArray([...array].sort((a, b) => a - b))}
                    className="btn btn-secondary"
                  >
                    <RotateCcw size={16} />
                    Sorted
                  </button>
                  <button 
                    onClick={() => setArray([...array].sort((a, b) => b - a))}
                    className="btn btn-secondary"
                  >
                    Reverse
                  </button>
                </div>
              )}

              {selectedCategory === 'searching' && (
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Target Value</label>
                    <input 
                      type="number" 
                      value={searchTarget}
                      onChange={(e) => setSearchTarget(Number(e.target.value))}
                      className="w-24"
                      min="1"
                      max="100"
                    />
                  </div>
                  <button 
                    onClick={regenerateArray}
                    className="btn btn-secondary"
                  >
                    <Shuffle size={16} />
                    New Array
                  </button>
                </div>
              )}

              {selectedCategory === 'graphs' && (
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Node</label>
                    <select 
                      value={startNode}
                      onChange={(e) => {
                        setStartNode(Number(e.target.value));
                        reset();
                      }}
                      className="w-24"
                    >
                      {graph.nodes.map(node => (
                        <option key={node.id} value={node.id}>{node.label}</option>
                      ))}
                    </select>
                  </div>
                  {selectedAlgorithm === 'dijkstra' && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Node</label>
                      <select 
                        value={endNode}
                        onChange={(e) => {
                          setEndNode(Number(e.target.value));
                          reset();
                        }}
                        className="w-24"
                      >
                        {graph.nodes.map(node => (
                          <option key={node.id} value={node.id}>{node.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      setGraph(createDefaultGraph());
                      reset();
                    }}
                    className="btn btn-secondary"
                  >
                    <RotateCcw size={16} />
                    Reset Graph
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visualization Board */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Visualization */}
          <div className="lg:col-span-2">
            {selectedCategory === 'graphs' ? (
              <GraphBoard 
                state={currentState} 
                algorithm={selectedAlgorithm}
              />
            ) : (
              <SortingBoard 
                state={currentState} 
                type={getVisualizationType()}
                algorithm={selectedAlgorithm}
              />
            )}

            {/* Controls */}
            <Controls 
              isPlaying={isPlaying} 
              togglePlay={togglePlay} 
              reset={reset} 
              next={next} 
              prev={prev}
              step={step} 
              totalSteps={totalSteps}
              speed={speed} 
              setSpeed={setSpeed}
              progress={progress}
              jumpTo={jumpTo}
            />
          </div>

          {/* Sidebar - Pseudocode & Info */}
          <div className="space-y-4">
            {/* Pseudocode Panel */}
            <PseudocodePanel 
              pseudocode={pseudocode} 
              currentLine={currentState.codeLine}
              title={`${selectedAlgorithm.charAt(0).toUpperCase() + selectedAlgorithm.slice(1)} Pseudocode`}
            />

            {/* Algorithm Info Card */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                About This Algorithm
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                {selectedAlgorithm === 'bubble' && (
                  <p>Bubble Sort repeatedly swaps adjacent elements if they are in wrong order. Simple but inefficient for large datasets.</p>
                )}
                {selectedAlgorithm === 'merge' && (
                  <p>Merge Sort divides array into halves, sorts them, then merges. Efficient O(n log n) with stable sorting.</p>
                )}
                {selectedAlgorithm === 'quick' && (
                  <p>Quick Sort picks a pivot and partitions the array. Average O(n log n), widely used in practice.</p>
                )}
                {selectedAlgorithm === 'binary' && (
                  <p>Binary Search repeatedly divides sorted array in half. O(log n) but requires sorted data.</p>
                )}
                {selectedAlgorithm === 'bfs' && (
                  <p>Breadth First Search explores neighbors level by level. Guarantees shortest path in unweighted graphs.</p>
                )}
                {selectedAlgorithm === 'dfs' && (
                  <p>Depth First Search explores as far as possible before backtracking. Uses less memory than BFS.</p>
                )}
                {selectedAlgorithm === 'dijkstra' && (
                  <p>Dijkstra's finds shortest paths from source to all nodes. Works with weighted graphs with non-negative weights.</p>
                )}
                {selectedAlgorithm === 'bellman' && (
                  <p>Bellman-Ford finds shortest paths from source to all nodes. Can handle negative edge weights and detect negative cycles.</p>
                )}
                {selectedAlgorithm === 'floyd' && (
                  <p>Floyd-Warshall finds shortest paths between all pairs of vertices. Uses dynamic programming with O(V³) complexity.</p>
                )}
                {selectedAlgorithm === 'prim' && (
                  <p>Prim's algorithm finds minimum spanning tree for a weighted undirected graph. Grows the MST one vertex at a time.</p>
                )}
                {selectedAlgorithm === 'kruskal' && (
                  <p>Kruskal's algorithm finds minimum spanning tree by sorting edges and adding them if they don't form a cycle.</p>
                )}
              </div>
            </div>

            {/* Complexity Info */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Time Complexity
              </h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-100 dark:bg-slate-700 rounded">
                  <div className="text-xs text-gray-500">Best</div>
                  <div className="font-mono font-semibold">
                    {selectedAlgorithm === 'bubble' && 'O(n)'}
                    {selectedAlgorithm === 'merge' && 'O(n log n)'}
                    {selectedAlgorithm === 'quick' && 'O(n log n)'}
                    {selectedAlgorithm === 'binary' && 'O(1)'}
                    {selectedAlgorithm === 'bfs' && 'O(V + E)'}
                    {selectedAlgorithm === 'dfs' && 'O(V + E)'}
                    {selectedAlgorithm === 'dijkstra' && 'O(E log V)'}
                    {selectedAlgorithm === 'bellman' && 'O(VE)'}
                    {selectedAlgorithm === 'floyd' && 'O(V³)'}
                    {selectedAlgorithm === 'prim' && 'O(E log V)'}
                    {selectedAlgorithm === 'kruskal' && 'O(E log E)'}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-100 dark:bg-slate-700 rounded">
                  <div className="text-xs text-gray-500">Average</div>
                  <div className="font-mono font-semibold">
                    {selectedAlgorithm === 'bubble' && 'O(n²)'}
                    {selectedAlgorithm === 'merge' && 'O(n log n)'}
                    {selectedAlgorithm === 'quick' && 'O(n log n)'}
                    {selectedAlgorithm === 'binary' && 'O(log n)'}
                    {selectedAlgorithm === 'bfs' && 'O(V + E)'}
                    {selectedAlgorithm === 'dfs' && 'O(V + E)'}
                    {selectedAlgorithm === 'dijkstra' && 'O(E log V)'}
                    {selectedAlgorithm === 'bellman' && 'O(VE)'}
                    {selectedAlgorithm === 'floyd' && 'O(V³)'}
                    {selectedAlgorithm === 'prim' && 'O(E log V)'}
                    {selectedAlgorithm === 'kruskal' && 'O(E log E)'}
                  </div>
                </div>
                <div className="text-center p-2 bg-gray-100 dark:bg-slate-700 rounded">
                  <div className="text-xs text-gray-500">Worst</div>
                  <div className="font-mono font-semibold">
                    {selectedAlgorithm === 'bubble' && 'O(n²)'}
                    {selectedAlgorithm === 'merge' && 'O(n log n)'}
                    {selectedAlgorithm === 'quick' && 'O(n²)'}
                    {selectedAlgorithm === 'binary' && 'O(log n)'}
                    {selectedAlgorithm === 'bfs' && 'O(V + E)'}
                    {selectedAlgorithm === 'dfs' && 'O(V + E)'}
                    {selectedAlgorithm === 'dijkstra' && 'O(E log V)'}
                    {selectedAlgorithm === 'bellman' && 'O(VE)'}
                    {selectedAlgorithm === 'floyd' && 'O(V³)'}
                    {selectedAlgorithm === 'prim' && 'O(E log V)'}
                    {selectedAlgorithm === 'kruskal' && 'O(E log E)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-slate-800 mt-12 py-6 bg-white dark:bg-slate-900" id="about">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">About AlgoVision</h2>
          <p className="mb-2">An interactive algorithm visualizer for engineering students.</p>
          <p className="mb-4">Built with React, TailwindCSS, and Framer Motion</p>
          <p>Visualize and understand algorithms step-by-step through animations.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
