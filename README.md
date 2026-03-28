# AlgoVision - Algorithm Visualizer

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-5.1.6-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Framer_Motion-11.0.8-000000?style=for-the-badge" alt="Framer Motion">
</p>

<p align="center">
  An interactive algorithm visualizer for engineering students to understand algorithms step-by-step through beautiful animations.
</p>

[![AlgoVision Preview](https://raw.githubusercontent.com/Suhaspr31/My-Portfolio/main/public/algovision-preview.png)](https://algovision-red.vercel.app/)
---

## ✨ Features

### Supported Algorithms

#### 🔢 Sorting Algorithms

| Algorithm   | Time Complexity (Average) | Space Complexity |
| ----------- | ------------------------- | ---------------- |
| Bubble Sort | O(n²)                     | O(1)             |
| Merge Sort  | O(n log n)                | O(n)             |
| Quick Sort  | O(n log n)                | O(log n)         |

#### 🔍 Search Algorithms

| Algorithm     | Time Complexity | Space Complexity |
| ------------- | --------------- | ---------------- |
| Binary Search | O(log n)        | O(1)             |

#### 🌐 Graph Algorithms

| Algorithm                  | Time Complexity | Space Complexity |
| -------------------------- | --------------- | ---------------- |
| Breadth First Search (BFS) | O(V + E)        | O(V)             |
| Depth First Search (DFS)   | O(V + E)        | O(V)             |
| Dijkstra's Algorithm       | O(E log V)      | O(V)             |
| Bellman-Ford Algorithm     | O(VE)           | O(V)             |
| Floyd-Warshall Algorithm   | O(V³)           | O(V²)            |
| Prim's Algorithm           | O(E log V)      | O(V)             |
| Kruskal's Algorithm        | O(E log E)      | O(V)             |

### Interactive Features

- **Step-by-step Visualization**: Watch algorithms execute one step at a time
- **Speed Control**: Adjust playback speed from Very Slow to Turbo
- **Play/Pause/Resume**: Control the visualization playback
- **Previous/Next Step**: Navigate through algorithm steps manually
- **Reset**: Start over with fresh data
- **Custom Input**:
  - Sorting: Adjustable array size, random generation, pre-sorted, reverse-sorted
  - Binary Search: Custom target value
  - Graph: Selectable start/end nodes
- **Pseudocode Panel**: View algorithm pseudocode with highlighted active lines
- **Explanation Text**: Real-time descriptions of what's happening at each step
- **Dark Mode**: Modern UI with dark/light theme toggle

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/algo-visualizer.git
   cd algo-visualizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

---

## 📁 Project Structure

```
algo-visualizer/
├── public/
├── src/
│   ├── algorithms/          # Pure algorithm logic
│   │   ├── bubbleSort.js
│   │   ├── mergeSort.js
│   │   ├── quickSort.js
│   │   ├── binarySearch.js
│   │   └── graphAlgorithms.js
│   ├── components/          # React UI components
│   │   ├── Controls.jsx
│   │   ├── SortingBoard.jsx
│   │   ├── GraphBoard.jsx
│   │   ├── Navbar.jsx
│   │   └── PseudocodePanel.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useAlgoPlayer.jsx
│   ├── utils/              # Utility functions
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🎨 Architecture

### Trace/Snapshot Pattern

The core innovation of AlgoVision is the **Trace/Snapshot Pattern**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALGORITHM EXECUTION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Algorithm Function                                            │
│        │                                                        │
│        │  Run instantly, generate all steps                     │
│        ▼                                                        │
│   ┌─────────────┐                                               │
│   │ Trace Array │  Each element is a "snapshot"                 │
│   │─────────────│  containing complete state                    │
│   │ Step 0      │  - Array/Graph state                          │
│   │ Step 1      │  - Comparison indices                         │
│   │ Step 2      │  - Swap operations                            │
│   │ ...         │  - Current line of pseudocode                 │
│   │ Step N      │  - Description text                           │
│   └─────────────┘                                               │
│                                                                 │
│   Playback Engine (useAlgoPlayer hook)                          │
│        │                                                        │
│        │  Simply plays back the trace                           │
│        │  like a video                                          │
│        ▼                                                        │
│   ┌─────────────┐                                               │
│   │   UI State  │  React renders current step                   │
│   └─────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Benefits:**

- ✅ True Pause: Just stop the step counter
- ✅ Rewind: Simply decrease the step counter
- ✅ Speed Control: Change the interval duration
- ✅ Smooth Animation: All computation happens upfront
- ✅ Time Travel: Jump to any step instantly

---

## 🔧 Customization

### Adding a New Sorting Algorithm

1. Create a new file in `src/algorithms/`:

```javascript
// src/algorithms/newSort.js

export const generateNewSort = (array) => {
  const trace = [];
  const arr = [...array];

  // Initial state
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: [],
    desc: "Starting New Sort",
    codeLine: 0,
  });

  // Your algorithm here...
  // Push snapshots to trace at each interesting step

  // Final state
  trace.push({
    array: [...arr],
    compare: [],
    swap: [],
    sorted: [...Array(arr.length).keys()],
    desc: "Sort Complete!",
    codeLine: 10,
  });

  return trace;
};

export const newSortPseudocode = ["START: ...", "...", "END: Array sorted"];
```

2. Import and add to `App.jsx`:

```javascript
import { generateNewSort, newSortPseudocode } from "./algorithms/newSort";

// Add to ALGORITHM_CATEGORIES.sorting
// Add to pseudocode switch statement
```

### Adding a New Graph Algorithm

Graph algorithms follow a similar pattern but work with the `graph` object structure:

```javascript
trace.push({
  graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
  visited: [...visited],
  highlight: [currentNode],
  edgesHighlight: [{ from: current, to: neighbor }],
  distances: { ...distances },
  parentMap: { ...parentMap },
  desc: "Description of current step",
  codeLine: 1,
});
```

---

## 🎯 Learning Outcomes

This project helps students understand:

1. **Algorithm Fundamentals**: How basic sorting and search algorithms work
2. **Time Complexity**: Visual difference between O(n²), O(n log n), O(log n), O(VE), and O(V³)
3. **Data Structure Traversal**: How BFS/DFS explore graphs differently
4. **Shortest Path**: How Dijkstra's, Bellman-Ford, and Floyd-Warshall find optimal paths in weighted graphs
5. **Minimum Spanning Tree**: How Prim's and Kruskal's algorithms build optimal spanning trees
6. **Visual Debugging**: Step through algorithms to understand each operation

---

## 🛠️ Tech Stack

| Technology        | Purpose                              |
| ----------------- | ------------------------------------ |
| **React 18**      | UI component library                 |
| **Vite 5**        | Fast build tool and dev server       |
| **TailwindCSS 3** | Utility-first styling with dark mode |
| **Framer Motion** | Smooth animations for bars and nodes |
| **Lucide React**  | Beautiful icon set                   |
| **ESLint**        | Code linting                         |

---

## 📝 License

MIT License - feel free to use for learning and teaching!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📚 Resources for Learning

- [Sorting Algorithms Visualization](https://visualgo.net/en/sorting)
- [Algorithm Wiki](https://en.wikipedia.org/wiki/Algorithm)
- [Big O Notation](https://www.bigocheatsheet.com/)

---

<p align="center">
  Built for Engineering Students
</p>
