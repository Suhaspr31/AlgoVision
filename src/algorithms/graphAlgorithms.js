/**
 * Graph Algorithms Implementation
 * 
 * Includes:
 * - Breadth First Search (BFS)
 * - Depth First Search (DFS)
 * - Dijkstra's Shortest Path Algorithm
 */

// Helper to create a default graph for visualization
export const createDefaultGraph = () => {
  return {
    nodes: [
      { id: 0, label: 'A', x: 100, y: 200 },
      { id: 1, label: 'B', x: 250, y: 100 },
      { id: 2, label: 'C', x: 250, y: 300 },
      { id: 3, label: 'D', x: 400, y: 100 },
      { id: 4, label: 'E', x: 400, y: 300 },
      { id: 5, label: 'F', x: 550, y: 200 },
    ],
    edges: [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 2 },
      { from: 1, to: 3, weight: 3 },
      { from: 1, to: 2, weight: 1 },
      { from: 2, to: 4, weight: 5 },
      { from: 3, to: 5, weight: 6 },
      { from: 4, to: 5, weight: 2 },
    ]
  };
};

/**
 * Generate BFS (Breadth First Search) trace
 * @param {Object} graph - Graph object with nodes and edges
 * @param {number} startNode - Starting node index
 * @returns {Array} Trace array containing each step of BFS
 */
export const generateBFS = (graph, startNode = 0) => {
  const trace = [];
  const adjList = buildAdjacencyList(graph);
  const visited = new Set();
  const queue = [];
  const discoveryOrder = [];
  const parentMap = new Map();

  // Initial state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    visited: [...visited],
    current: -1,
    queue: [...queue],
    discoveryOrder: [...discoveryOrder],
    highlight: [],
    edgesHighlight: [],
    distances: {},
    parentMap: {},
    desc: `BFS: Starting from node ${graph.nodes[startNode].label}`,
    codeLine: 0
  });

  // Mark start node as visited and enqueue it
  visited.add(startNode);
  queue.push(startNode);
  
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    visited: [...visited],
    current: startNode,
    queue: [...queue],
    discoveryOrder: [...discoveryOrder],
    highlight: [startNode],
    edgesHighlight: [],
    distances: { [startNode]: 0 },
    parentMap: {},
    desc: `BFS: Mark ${graph.nodes[startNode].label} as visited and add to queue`,
    codeLine: 1
  });

  while (queue.length > 0) {
    const current = queue.shift();
    discoveryOrder.push(current);

    trace.push({
      graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
      visited: [...visited],
      current: current,
      queue: [...queue],
      discoveryOrder: [...discoveryOrder],
      highlight: [...visited],
      edgesHighlight: [],
      distances: { ...trace[trace.length - 1].distances },
      parentMap: Object.fromEntries(parentMap),
      desc: `BFS: Dequeued node ${graph.nodes[current].label}, now exploring neighbors`,
      codeLine: 2
    });

    // Get neighbors in sorted order by node label for consistent visualization
    const neighbors = (adjList[current] || []).sort((a, b) => 
      graph.nodes[a].label.localeCompare(graph.nodes[b].label)
    );

    for (const neighbor of neighbors) {
      trace.push({
        graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
        visited: [...visited],
        current: current,
        queue: [...queue],
        discoveryOrder: [...discoveryOrder],
        highlight: [...visited, current, neighbor],
        edgesHighlight: [{ from: current, to: neighbor }],
        distances: { ...trace[trace.length - 1].distances },
        parentMap: Object.fromEntries(parentMap),
        desc: `BFS: Checking neighbor ${graph.nodes[neighbor].label} of ${graph.nodes[current].label}`,
        codeLine: 3
      });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        parentMap.set(neighbor, current);
        const distance = trace[trace.length - 1].distances[current] + 
          graph.edges.find(e => (e.from === current && e.to === neighbor) || (e.from === neighbor && e.to === current))?.weight || 1;
        
        trace.push({
          graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
          visited: [...visited],
          current: neighbor,
          queue: [...queue],
          discoveryOrder: [...discoveryOrder],
          highlight: [...visited, neighbor],
          edgesHighlight: [{ from: current, to: neighbor }],
          distances: { ...trace[trace.length - 1].distances, [neighbor]: distance },
          parentMap: Object.fromEntries(parentMap),
          desc: `BFS: ${graph.nodes[neighbor].label} not visited, marking as visited and enqueuing`,
          codeLine: 4
        });
      }
    }
  }

  // Final state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    visited: [...visited],
    current: -1,
    queue: [],
    discoveryOrder: [...discoveryOrder],
    highlight: [...visited],
    edgesHighlight: discoveryOrder.slice(1).map((node, idx) => ({
      from: parentMap.get(node),
      to: node
    })),
    distances: trace[trace.length - 1].distances,
    parentMap: Object.fromEntries(parentMap),
    desc: `BFS Complete! Discovery order: ${discoveryOrder.map(i => graph.nodes[i].label).join(' → ')}`,
    codeLine: 5
  });

  return trace;
};

/**
 * Generate DFS (Depth First Search) trace
 * @param {Object} graph - Graph object with nodes and edges
 * @param {number} startNode - Starting node index
 * @returns {Array} Trace array containing each step of DFS
 */
export const generateDFS = (graph, startNode = 0) => {
  const trace = [];
  const adjList = buildAdjacencyList(graph);
  const visited = new Set();
  const stack = [];
  const discoveryOrder = [];
  const parentMap = new Map();

  // Initial state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    visited: [...visited],
    current: -1,
    stack: [...stack],
    discoveryOrder: [...discoveryOrder],
    highlight: [],
    edgesHighlight: [],
    parentMap: {},
    desc: `DFS: Starting from node ${graph.nodes[startNode].label}`,
    codeLine: 0
  });

  const dfs = (node) => {
    visited.add(node);
    stack.push(node);

    trace.push({
      graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
      visited: [...visited],
      current: node,
      stack: [...stack],
      discoveryOrder: [...discoveryOrder, node],
      highlight: [...visited],
      edgesHighlight: [],
      parentMap: Object.fromEntries(parentMap),
      desc: `DFS: Visiting node ${graph.nodes[node].label}`,
      codeLine: 1
    });

    discoveryOrder.push(node);

    // Get neighbors in reverse order for proper stack visualization
    const neighbors = (adjList[node] || []).sort((a, b) => 
      graph.nodes[b].label.localeCompare(graph.nodes[a].label)
    );

    for (const neighbor of neighbors) {
      trace.push({
        graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
        visited: [...visited],
        current: node,
        stack: [...stack],
        discoveryOrder: [...discoveryOrder],
        highlight: [...visited, neighbor],
        edgesHighlight: [{ from: node, to: neighbor }],
        parentMap: Object.fromEntries(parentMap),
        desc: `DFS: Checking neighbor ${graph.nodes[neighbor].label} of ${graph.nodes[node].label}`,
        codeLine: 2
      });

      if (!visited.has(neighbor)) {
        parentMap.set(neighbor, node);
        dfs(neighbor);

        trace.push({
          graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
          visited: [...visited],
          current: node,
          stack: [...stack],
          discoveryOrder: [...discoveryOrder],
          highlight: [...visited],
          edgesHighlight: [{ from: node, to: neighbor }],
          parentMap: Object.fromEntries(parentMap),
          desc: `DFS: Backtracking to ${graph.nodes[node].label} after exploring ${graph.nodes[neighbor].label}`,
          codeLine: 3
        });
      }
    }

    stack.pop();
  };

  dfs(startNode);

  // Final state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    visited: [...visited],
    current: -1,
    stack: [],
    discoveryOrder: [...discoveryOrder],
    highlight: [...visited],
    edgesHighlight: discoveryOrder.slice(1).map((node, idx) => ({
      from: parentMap.get(node),
      to: node
    })),
    parentMap: Object.fromEntries(parentMap),
    desc: `DFS Complete! Discovery order: ${discoveryOrder.map(i => graph.nodes[i].label).join(' → ')}`,
    codeLine: 4
  });

  return trace;
};

/**
 * Generate Dijkstra's Shortest Path trace
 * @param {Object} graph - Graph object with nodes and edges
 * @param {number} startNode - Starting node index
 * @param {number} endNode - Target node index
 * @returns {Array} Trace array containing each step of Dijkstra
 */
export const generateDijkstra = (graph, startNode = 0, endNode = 5) => {
  const trace = [];
  const adjList = buildAdjacencyList(graph);
  
  // Initialize distances to infinity except start node
  const distances = {};
  const previous = {};
  const visited = new Set();
  const unvisited = new Set(graph.nodes.map(n => n.id));
  
  graph.nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startNode] = 0;

  // Initial state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    visited: [...visited],
    unvisited: [...unvisited],
    current: -1,
    highlight: [startNode],
    edgesHighlight: [],
    distances: { ...distances },
    previous: { ...previous },
    shortestPath: [],
    desc: `Dijkstra: Starting from ${graph.nodes[startNode].label}, distance = 0`,
    codeLine: 0
  });

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let current = null;
    let minDistance = Infinity;
    
    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        current = nodeId;
      }
    }

    if (current === null || current === endNode) break;

    unvisited.delete(current);
    visited.add(current);

    trace.push({
      graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
      visited: [...visited],
      unvisited: [...unvisited],
      current: current,
      highlight: [...visited, current],
      edgesHighlight: [],
      distances: { ...distances },
      previous: { ...previous },
      shortestPath: [],
      desc: `Dijkstra: Visiting ${graph.nodes[current].label} with distance ${distances[current] === Infinity ? '∞' : distances[current]}`,
      codeLine: 1
    });

    // Check all neighbors
    const neighbors = adjList[current] || [];
    
    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;

      // Find edge weight
      const edge = graph.edges.find(e => 
        (e.from === current && e.to === neighbor) || 
        (e.from === neighbor && e.to === current)
      );
      const weight = edge ? edge.weight : 1;

      trace.push({
        graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
        visited: [...visited],
        unvisited: [...unvisited],
        current: current,
        highlight: [...visited, current, neighbor],
        edgesHighlight: [{ from: current, to: neighbor }],
        distances: { ...distances },
        previous: { ...previous },
        shortestPath: [],
        desc: `Dijkstra: Checking ${graph.nodes[neighbor].label}, current distance through ${graph.nodes[current].label}: ${distances[current] + weight}`,
        codeLine: 2
      });

      const newDistance = distances[current] + weight;
      
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;

        trace.push({
          graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
          visited: [...visited],
          unvisited: [...unvisited],
          current: current,
          highlight: [...visited, current, neighbor],
          edgesHighlight: [{ from: current, to: neighbor }],
          distances: { ...distances },
          previous: { ...previous },
          shortestPath: [],
          desc: `Dijkstra: Found shorter path to ${graph.nodes[neighbor].label}! New distance: ${newDistance}`,
          codeLine: 3
        });
      }
    }
  }

  // Reconstruct shortest path
  const shortestPath = [];
  let current = endNode;
  while (current !== null) {
    shortestPath.unshift(current);
    current = previous[current];
  }

  // Final state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    visited: [...visited],
    unvisited: [...unvisited],
    current: -1,
    highlight: [...shortestPath],
    edgesHighlight: shortestPath.slice(0, -1).map((node, idx) => ({
      from: node,
      to: shortestPath[idx + 1]
    })),
    distances: { ...distances },
    previous: { ...previous },
    shortestPath: shortestPath,
    desc: `Dijkstra Complete! Shortest path: ${shortestPath.map(i => graph.nodes[i].label).join(' → ')} (Total distance: ${distances[endNode] === Infinity ? '∞' : distances[endNode]})`,
    codeLine: 4
  });

  return trace;
};

/**
 * Build adjacency list from graph
 */
const buildAdjacencyList = (graph) => {
  const adjList = {};
  graph.nodes.forEach(node => {
    adjList[node.id] = [];
  });
  graph.edges.forEach(edge => {
    adjList[edge.from].push(edge.to);
    adjList[edge.to].push(edge.from);
  });
  return adjList;
};

/**
 * Pseudocode for BFS
 */
export const bfsPseudocode = [
  "START: Create queue and mark start node as visited",
  "WHILE queue is not empty:",
  "  Dequeue current node",
  "  FOR each neighbor of current:",
  "    IF neighbor not visited:",
  "      Mark neighbor as visited",
  "      Enqueue neighbor",
  "    END IF",
  "  END FOR",
  "END WHILE",
  "END: All reachable nodes visited"
];

/**
 * Pseudocode for DFS
 */
export const dfsPseudocode = [
  "START: Mark start node as visited and push to stack",
  "WHILE stack is not empty:",
  "  Pop current node",
  "  FOR each neighbor of current:",
  "    IF neighbor not visited:",
  "      Mark neighbor as visited",
  "      Push neighbor to stack",
  "    END IF",
  "  END FOR",
  "END WHILE",
  "END: All reachable nodes visited"
];

/**
 * Pseudocode for Dijkstra
 */
export const dijkstraPseudocode = [
  "START: Set all distances to ∞, start node to 0",
  "WHILE unvisited nodes exist:",
  "  Select unvisited node with min distance",
  "  IF no reachable nodes remain, break",
  "  FOR each neighbor of current:",
  "    Calculate new distance = current + edge_weight",
  "    IF new distance < neighbor's distance:",
  "      Update neighbor's distance",
  "      Set current as neighbor's predecessor",
  "    END IF",
  "  END FOR",
  "END WHILE",
  "END: Reconstruct path from predecessors"
];

/**
 * Generate Prim's MST trace
 * @param {Object} graph - Graph object with nodes and edges
 * @returns {Array} Trace array containing each step of Prim's algorithm
 */
export const generatePrim = (graph) => {
  const trace = [];
  const V = graph.nodes.length;
  const parent = {};
  const key = {};
  const mstSet = new Set();
  
  // Initialize
  graph.nodes.forEach(node => {
    key[node.id] = Infinity;
    parent[node.id] = -1;
  });
  key[0] = 0; // Start from first node

  // Initial state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    parent: { ...parent },
    key: { ...key },
    mstSet: [...mstSet],
    mstEdges: [],
    current: -1,
    highlight: [],
    edgesHighlight: [],
    desc: "Prim's: Starting MST from node A (key = 0)",
    codeLine: 0
  });

  for (let count = 0; count < V; count++) {
    // Find min key vertex not in MST
    let u = -1;
    let minKey = Infinity;
    
    for (const nodeId of graph.nodes) {
      if (!mstSet.has(nodeId.id) && key[nodeId.id] < minKey) {
        minKey = key[nodeId.id];
        u = nodeId.id;
      }
    }

    if (u === -1) break;

    mstSet.add(u);

    // Build current MST edges
    const mstEdges = Object.entries(parent)
      .filter(([nodeId, p]) => p !== -1)
      .map(([nodeId, p]) => ({ from: parseInt(p), to: parseInt(nodeId) }));

    trace.push({
      graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
      parent: { ...parent },
      key: { ...key },
      mstSet: [...mstSet],
      mstEdges: mstEdges,
      current: u,
      highlight: [...mstSet],
      edgesHighlight: [],
      desc: `Prim's: Added node ${graph.nodes[u].label} to MST`,
      codeLine: 1
    });

    // Update neighbors
    const neighbors = graph.edges.filter(e => e.from === u || e.to === u);
    
    for (const edge of neighbors) {
      const v = edge.from === u ? edge.to : edge.from;
      
      if (!mstSet.has(v) && edge.weight < key[v]) {
        parent[v] = u;
        key[v] = edge.weight;

        const updatedMstEdges = Object.entries(parent)
          .filter(([nodeId, p]) => p !== -1)
          .map(([nodeId, p]) => ({ from: parseInt(p), to: parseInt(nodeId) }));

        trace.push({
          graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
          parent: { ...parent },
          key: { ...key },
          mstSet: [...mstSet],
          mstEdges: updatedMstEdges,
          current: u,
          highlight: [...mstSet, v],
          edgesHighlight: [{ from: u, to: v }],
          desc: `Prim's: Updated key of ${graph.nodes[v].label} to ${edge.weight}`,
          codeLine: 2
        });
      }
    }
  }

  // Final state - build complete MST edges
  const finalMstEdges = Object.entries(parent)
    .filter(([nodeId, p]) => p !== -1)
    .map(([nodeId, p]) => ({ from: parseInt(p), to: parseInt(nodeId) }));

  const totalWeight = Object.values(key).reduce((sum, val) => sum + (val === Infinity ? 0 : val), 0);

  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    parent: { ...parent },
    key: { ...key },
    mstSet: [...mstSet],
    mstEdges: finalMstEdges,
    current: -1,
    highlight: [...mstSet],
    edgesHighlight: finalMstEdges,
    desc: `Prim's MST Complete! Total weight: ${totalWeight}`,
    codeLine: 3
  });

  return trace;
};

/**
 * Generate Kruskal's MST trace
 * @param {Object} graph - Graph object with nodes and edges
 * @returns {Array} Trace array containing each step of Kruskal's algorithm
 */
export const generateKruskal = (graph) => {
  const trace = [];
  
  // Initialize Union-Find
  const parent = {};
  const rank = {};
  graph.nodes.forEach(node => {
    parent[node.id] = node.id;
    rank[node.id] = 0;
  });

  // Find function with path compression
  const find = (i) => {
    if (parent[i] !== i) {
      parent[i] = find(parent[i]);
    }
    return parent[i];
  };

  // Union function by rank
  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    
    if (rootI !== rootJ) {
      if (rank[rootI] < rank[rootJ]) {
        parent[rootI] = rootJ;
      } else if (rank[rootI] > rank[rootJ]) {
        parent[rootJ] = rootI;
      } else {
        parent[rootI] = rootJ;
        rank[rootJ]++;
      }
      return true;
    }
    return false;
  };

  // Sort edges by weight
  const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);
  const mstEdges = [];
  const visitedEdges = [];

  // Initial state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    mstEdges: [],
    visitedEdges: [],
    current: -1,
    highlight: [],
    edgesHighlight: [],
    parent: { ...parent },
    desc: "Kruskal's: Sorted all edges by weight",
    codeLine: 0
  });

  // Process each edge
  for (const edge of sortedEdges) {
    const u = edge.from;
    const v = edge.to;

    visitedEdges.push({ from: u, to: v });

    trace.push({
      graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
      mstEdges: [...mstEdges],
      visitedEdges: [...visitedEdges],
      current: -1,
      highlight: [],
      edgesHighlight: [{ from: u, to: v }],
      parent: { ...parent },
      desc: `Kruskal's: Checking edge ${graph.nodes[u].label}-${graph.nodes[v].label} (weight: ${edge.weight})`,
      codeLine: 1
    });

    if (find(u) !== find(v)) {
      union(u, v);
      mstEdges.push({ from: u, to: v });

      trace.push({
        graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
        mstEdges: [...mstEdges],
        visitedEdges: [...visitedEdges],
        current: -1,
        highlight: [u, v],
        edgesHighlight: [{ from: u, to: v }],
        parent: { ...parent },
        desc: `Kruskal's: No cycle! Added ${graph.nodes[u].label}-${graph.nodes[v].label} to MST`,
        codeLine: 2
      });
    } else {
      trace.push({
        graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
        mstEdges: [...mstEdges],
        visitedEdges: [...visitedEdges],
        current: -1,
        highlight: [],
        edgesHighlight: [{ from: u, to: v }],
        parent: { ...parent },
        desc: `Kruskal's: Cycle detected! Skipping ${graph.nodes[u].label}-${graph.nodes[v].label}`,
        codeLine: 3
      });
    }

    // Stop if we have V-1 edges
    if (mstEdges.length === graph.nodes.length - 1) break;
  }

  // Calculate total weight
  const totalWeight = mstEdges.reduce((sum, edge) => {
    const originalEdge = graph.edges.find(e => 
      (e.from === edge.from && e.to === edge.to) ||
      (e.from === edge.to && e.to === edge.from)
    );
    return sum + (originalEdge ? originalEdge.weight : 0);
  }, 0);

  // Final state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    mstEdges: [...mstEdges],
    visitedEdges: [...visitedEdges],
    current: -1,
    highlight: [...mstSetFromEdges(mstEdges)],
    edgesHighlight: [...mstEdges],
    parent: { ...parent },
    desc: `Kruskal's MST Complete! Total weight: ${totalWeight}`,
    codeLine: 4
  });

  return trace;
};

// Helper to get set of nodes from MST edges
const mstSetFromEdges = (mstEdges) => {
  const set = new Set();
  mstEdges.forEach(e => {
    set.add(e.from);
    set.add(e.to);
  });
  return [...set];
};

/**
 * Pseudocode for Prim's
 */
export const primPseudocode = [
  "START: Initialize keys to ∞, parent to -1",
  "WHILE all vertices not in MST:",
  "  Pick vertex u with minimum key",
  "  Add u to MST",
  "  FOR each vertex v adjacent to u:",
  "    IF v not in MST and weight(u,v) < key[v]:",
  "      Update key[v] and parent[v]",
  "    END IF",
  "  END FOR",
  "END WHILE",
  "END: MST complete"
];

/**
 * Pseudocode for Kruskal's
 */
export const kruskalPseudocode = [
  "START: Sort all edges by weight",
  "FOR each edge in sorted order:",
  "  IF adding edge doesn't form cycle:",
  "    Add edge to MST",
  "  ELSE:",
  "    Skip edge (forms cycle)",
  "  END IF",
  "  Stop when MST has V-1 edges",
  "END FOR",
  "END: MST complete"
];

/**
 * Generate Bellman-Ford trace
 * @param {Object} graph - Graph object with nodes and edges
 * @param {number} startNode - Starting node index
 * @returns {Array} Trace array containing each step of Bellman-Ford
 */
export const generateBellmanFord = (graph, startNode = 0) => {
  const trace = [];
  const V = graph.nodes.length;
  const distances = {};
  const previous = {};
  
  // Initialize distances
  graph.nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  distances[startNode] = 0;

  // Initial state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    distances: { ...distances },
    previous: { ...previous },
    current: -1,
    highlight: [startNode],
    edgesHighlight: [],
    desc: `Bellman-Ford: Initialize distances, ${graph.nodes[startNode].label} = 0`,
    codeLine: 0
  });

  // Relax edges V-1 times
  for (let i = 0; i < V - 1; i++) {
    let changed = false;
    
    trace.push({
      graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
      distances: { ...distances },
      previous: { ...previous },
      current: -1,
      highlight: [],
      edgesHighlight: [],
      desc: `Bellman-Ford: Iteration ${i + 1} of ${V - 1}`,
      codeLine: 1
    });

    for (const edge of graph.edges) {
      const u = edge.from;
      const v = edge.to;
      const weight = edge.weight;

      trace.push({
        graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
        distances: { ...distances },
        previous: { ...previous },
        current: -1,
        highlight: [u, v],
        edgesHighlight: [{ from: u, to: v }],
        desc: `Bellman-Ford: Checking edge ${graph.nodes[u].label} → ${graph.nodes[v].label} (weight: ${weight})`,
        codeLine: 2
      });

      if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        previous[v] = u;
        changed = true;

        trace.push({
          graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
          distances: { ...distances },
          previous: { ...previous },
          current: v,
          highlight: [u, v],
          edgesHighlight: [{ from: u, to: v }],
          desc: `Bellman-Ford: Relaxed! New distance to ${graph.nodes[v].label}: ${distances[v]}`,
          codeLine: 3
        });
      }
    }

    if (!changed) break;
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  for (const edge of graph.edges) {
    const u = edge.from;
    const v = edge.to;
    const weight = edge.weight;

    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      hasNegativeCycle = true;
      break;
    }
  }

  // Final state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    distances: { ...distances },
    previous: { ...previous },
    current: -1,
    highlight: [],
    edgesHighlight: [],
    desc: hasNegativeCycle 
      ? "Bellman-Ford: Negative cycle detected!" 
      : `Bellman-Ford Complete! All shortest paths found.`,
    codeLine: 4
  });

  return trace;
};

/**
 * Generate Floyd-Warshall trace (All-Pairs Shortest Paths)
 * @param {Object} graph - Graph object with nodes and edges
 * @returns {Array} Trace array containing each step of Floyd-Warshall
 */
export const generateFloydWarshall = (graph) => {
  const trace = [];
  const V = graph.nodes.length;
  
  // Initialize distance matrix
  const dist = Array(V).fill(null).map(() => Array(V).fill(Infinity));
  
  // Fill diagonal with 0
  for (let i = 0; i < V; i++) {
    dist[i][i] = 0;
  }

  // Fill initial edges
  for (const edge of graph.edges) {
    dist[edge.from][edge.to] = edge.weight;
    // For undirected graph, also set reverse
    dist[edge.to][edge.from] = edge.weight;
  }

  // Initial state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    matrix: dist.map(row => [...row]),
    current: -1,
    activeTriplet: [],
    highlight: [],
    edgesHighlight: [],
    desc: "Floyd-Warshall: Initialized distance matrix",
    codeLine: 0
  });

  // Triple loop: k = intermediate, i = source, j = destination
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        // Skip if no path exists through k
        if (dist[i][k] === Infinity || dist[k][j] === Infinity) continue;

        trace.push({
          graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
          matrix: dist.map(row => [...row]),
          current: k,
          activeTriplet: [i, k, j],
          highlight: [i, k, j],
          edgesHighlight: [
            { from: i, to: k },
            { from: k, to: j }
          ],
          desc: `Floyd-Warshall: Checking path ${graph.nodes[i].label} → ${graph.nodes[k].label} → ${graph.nodes[j].label}`,
          codeLine: 1
        });

        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];

          trace.push({
            graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
            matrix: dist.map(row => [...row]),
            current: k,
            activeTriplet: [i, k, j],
            highlight: [i, j],
            edgesHighlight: [{ from: i, to: j }],
            desc: `Floyd-Warshall: Updated! ${graph.nodes[i].label}→${graph.nodes[j].label} = ${dist[i][j]}`,
            codeLine: 2
          });
        }
      }
    }
  }

  // Final state
  trace.push({
    graph: { nodes: [...graph.nodes], edges: [...graph.edges] },
    matrix: dist.map(row => [...row]),
    current: -1,
    activeTriplet: [],
    highlight: [],
    edgesHighlight: [],
    desc: `Floyd-Warshall Complete! All-pairs shortest paths found.`,
    codeLine: 3
  });

  return trace;
};

/**
 * Pseudocode for Bellman-Ford
 */
export const bellmanFordPseudocode = [
  "START: Initialize distances to ∞, start node to 0",
  "REPEAT V-1 times:",
  "  FOR each edge (u, v) with weight w:",
  "    IF dist[u] + w < dist[v]:",
  "      dist[v] = dist[u] + w",
  "      predecessor[v] = u",
  "    END IF",
  "  END FOR",
  "END REPEAT",
  "CHECK for negative cycles",
  "END: Shortest paths computed"
];

/**
 * Pseudocode for Floyd-Warshall
 */
export const floydWarshallPseudocode = [
  "START: Initialize matrix with direct edge weights",
  "FOR k = 0 to V-1 (intermediate nodes):",
  "  FOR i = 0 to V-1 (source):",
  "    FOR j = 0 to V-1 (destination):",
  "      IF dist[i][k] + dist[k][j] < dist[i][j]:",
  "        dist[i][j] = dist[i][k] + dist[k][j]",
  "      END IF",
  "    END FOR",
  "  END FOR",
  "END FOR",
  "END: All pairs shortest paths computed"
];
