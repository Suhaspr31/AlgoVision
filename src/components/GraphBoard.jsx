import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * GraphBoard Component
 * 
 * Visualizes graph algorithms (BFS, DFS, Dijkstra) with animated nodes and edges.
 */
const GraphBoard = ({ state, algorithm }) => {
  // Show placeholder when no state
  if (!state || !state.graph) {
    return (
      <div className="h-[400px] md:h-[500px] w-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl shadow-inner border dark:border-slate-800">
        <p className="text-gray-500 dark:text-gray-400">Loading graph...</p>
      </div>
    );
  }

  // Fallback if graph data is incomplete
  if (!state.graph.nodes || !state.graph.edges || !Array.isArray(state.graph.nodes)) {
    return (
      <div className="h-[400px] md:h-[500px] w-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl shadow-inner border dark:border-slate-800">
        <p className="text-gray-500 dark:text-gray-400">Invalid graph data</p>
      </div>
    );
  }

  const { 
    graph, 
    visited = [], 
    highlight = [], 
    edgesHighlight = [],
    current = -1,
    distances = {},
    shortestPath = [],
    discoveryOrder = [],
    stack = [],
    queue = [],
    mstEdges = [],
    mstSet = [],
    visitedEdges = [],
    matrix = null,
    activeTriplet = []
  } = state;

  // Calculate edge positions for highlighting
  const highlightedEdgeSet = useMemo(() => {
    return new Set(
      edgesHighlight.map(e => `${Math.min(e.from, e.to)}-${Math.max(e.from, e.to)}`)
    );
  }, [edgesHighlight]);

  // Get node color based on state
  const getNodeColor = (nodeId) => {
    // Floyd-Warshall colors
    if (algorithm === 'floyd' && activeTriplet.length === 3) {
      const [src, k, dest] = activeTriplet;
      if (nodeId === k) return 'bg-purple-500 border-purple-400 animate-pulse';
      if (nodeId === src) return 'bg-green-400 border-green-300';
      if (nodeId === dest) return 'bg-red-400 border-red-300';
      return 'bg-gray-300 dark:bg-slate-600 border-gray-400 dark:border-slate-500';
    }

    // Bellman-Ford colors
    if (algorithm === 'bellman') {
      if (visited.includes(nodeId)) return 'bg-blue-400 border-blue-300';
      if (current === nodeId) return 'bg-yellow-500 border-yellow-400 animate-pulse';
      return 'bg-gray-300 dark:bg-slate-600 border-gray-400 dark:border-slate-500';
    }

    // MST algorithms (Prim/Kruskal)
    if (algorithm === 'prim' || algorithm === 'kruskal') {
      if (mstEdges.length > 0 && mstSet && mstSet.includes(nodeId)) return 'bg-green-500 border-green-400';
      if (mstSet && mstSet.includes(nodeId)) return 'bg-green-500 border-green-400';
      if (current === nodeId) return 'bg-yellow-500 border-yellow-400 animate-pulse';
      if (highlight.includes(nodeId)) return 'bg-blue-400 border-blue-300';
      return 'bg-gray-300 dark:bg-slate-600 border-gray-400 dark:border-slate-500';
    }

    if (algorithm === 'dijkstra') {
      // Dijkstra colors
      if (shortestPath.includes(nodeId)) return 'bg-green-500 border-green-400';
      if (visited.includes(nodeId)) return 'bg-primary border-primary-light';
      if (current === nodeId) return 'bg-yellow-500 border-yellow-400 animate-pulse';
      return 'bg-gray-300 dark:bg-slate-600 border-gray-400 dark:border-slate-500';
    }
    
    if (algorithm === 'dfs') {
      // DFS colors
      if (shortestPath && shortestPath.length > 0 && shortestPath.includes(nodeId)) {
        return 'bg-green-500 border-green-400';
      }
      if (current === nodeId) return 'bg-yellow-500 border-yellow-400 animate-pulse';
      if (visited.includes(nodeId)) return 'bg-purple-500 border-purple-400';
      return 'bg-gray-300 dark:bg-slate-600 border-gray-400 dark:border-slate-500';
    }

    // BFS colors
    if (shortestPath && shortestPath.length > 0 && shortestPath.includes(nodeId)) {
      return 'bg-green-500 border-green-400';
    }
    if (current === nodeId) return 'bg-yellow-500 border-yellow-400 animate-pulse';
    if (visited.includes(nodeId)) return 'bg-purple-500 border-purple-400';
    return 'bg-gray-300 dark:bg-slate-600 border-gray-400 dark:border-slate-500';
  };

  // Get edge color based on state
  const getEdgeColor = (edge) => {
    const edgeKey = `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}`;
    
    // Floyd-Warshall triplet highlight
    if (algorithm === 'floyd' && activeTriplet.length === 3) {
      const [src, k, dest] = activeTriplet;
      // Highlight the path being checked: src -> k -> dest
      if ((edge.from === src && edge.to === k) || (edge.from === k && edge.to === src) ||
          (edge.from === k && edge.to === dest) || (edge.from === dest && edge.to === k)) {
        return 'stroke-purple-500 stroke-[4px]';
      }
    }

    // Bellman-Ford edge highlighting
    if (algorithm === 'bellman') {
      if (highlightedEdgeSet.has(edgeKey)) {
        return 'stroke-yellow-500 stroke-[4px]';
      }
    }
    
    // Check for MST edges (Prim/Kruskal)
    if (mstEdges.length > 0) {
      const isMstEdge = mstEdges.some(e => 
        (Math.min(e.from, e.to) === Math.min(edge.from, edge.to) && 
         Math.max(e.from, e.to) === Math.max(edge.from, edge.to))
      );
      if (isMstEdge) return 'stroke-green-500 stroke-[4px]';
    }
    
    // Check for currently being processed edge
    if (highlightedEdgeSet.has(edgeKey)) {
      return 'stroke-yellow-500 stroke-[4px]';
    }

    // Check for visited edges in traversal
    if (visitedEdges && visitedEdges.length > 0) {
      const isVisitedEdge = visitedEdges.some(e => 
        (Math.min(e.from, e.to) === Math.min(edge.from, edge.to) && 
         Math.max(e.from, e.to) === Math.max(edge.from, edge.to))
      );
      if (isVisitedEdge) return 'stroke-orange-400 stroke-[3px]';
    }
    
    if (shortestPath.length > 0) {
      const isShortestPathEdge = shortestPath.slice(0, -1).some((node, idx) => 
        (node === edge.from && shortestPath[idx + 1] === edge.to) ||
        (node === edge.to && shortestPath[idx + 1] === edge.from)
      );
      if (isShortestPathEdge) return 'stroke-green-500 stroke-[4px]';
    }

    if (highlightedEdgeSet.has(edgeKey)) {
      return 'stroke-yellow-500 stroke-[4px]';
    }

    if (visited.includes(edge.from) && visited.includes(edge.to)) {
      return 'stroke-purple-500/50';
    }

    return 'stroke-gray-400 dark:stroke-slate-500';
  };

  return (
    <div className="h-[400px] md:h-[500px] w-full relative bg-white dark:bg-slate-900 rounded-xl shadow-inner border dark:border-slate-800 overflow-hidden">
      
      {/* Explanation Bubble */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow border dark:border-slate-700 z-10 max-w-md">
        <p className="font-mono text-sm text-gray-700 dark:text-gray-200">
          {state.desc}
        </p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 text-xs z-10 bg-white/90 dark:bg-slate-800/90 p-2 rounded-lg">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Current
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span> Visited
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span> Path/MST
        </span>
        {(algorithm === 'prim' || algorithm === 'kruskal') && (
          <span className="flex items-center gap-1 mt-1">
            <span className="w-3 h-3 bg-blue-400 rounded-full"></span> Processing
          </span>
        )}
        {(algorithm === 'bellman' || algorithm === 'floyd') && (
          <span className="flex items-center gap-1 mt-1">
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span> Checking
          </span>
        )}
        {algorithm === 'dijkstra' && (
          <span className="text-xs text-gray-500 mt-1">
            Dist: {Object.entries(distances).map(([id, d]) => 
              `${graph.nodes[id].label}:${d === Infinity ? '∞' : d}`
            ).join(', ')}
          </span>
        )}
      </div>

      {/* Graph SVG */}
      <svg className="w-full h-full" viewBox="0 0 700 400">
        {/* Edges */}
        {graph.edges.map((edge, idx) => (
          <motion.g
            key={`edge-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <line
              x1={edge.from !== undefined ? graph.nodes[edge.from].x : 0}
              y1={edge.from !== undefined ? graph.nodes[edge.from].y : 0}
              x2={edge.to !== undefined ? graph.nodes[edge.to].x : 0}
              y2={edge.to !== undefined ? graph.nodes[edge.to].y : 0}
              className={`transition-all duration-300 ${getEdgeColor(edge)}`}
              strokeLinecap="round"
            />
            {/* Edge weight label */}
            {edge.weight !== undefined && (
              <text
                x={(graph.nodes[edge.from].x + graph.nodes[edge.to].x) / 2}
                y={(graph.nodes[edge.from].y + graph.nodes[edge.to].y) / 2 - 10}
                className="text-xs fill-gray-500 dark:fill-gray-400 font-mono"
                textAnchor="middle"
              >
                {edge.weight}
              </text>
            )}
          </motion.g>
        ))}

        {/* Nodes */}
        {graph.nodes.map((node, idx) => (
          <motion.g
            key={`node-${idx}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            {/* Node circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={30}
              className={`stroke-3 transition-all duration-300 ${getNodeColor(node.id)}`}
              whileHover={{ scale: 1.1 }}
            />
            {/* Node label */}
            <text
              x={node.x}
              y={node.y + 5}
              className="text-sm font-bold fill-white dark:text-white text-center"
              textAnchor="middle"
            >
              {node.label}
            </text>
            {/* Distance label for Dijkstra */}
            {(algorithm === 'dijkstra' || algorithm === 'bellman') && distances[node.id] !== undefined && (
              <text
                x={node.x}
                y={node.y - 40}
                className="text-xs fill-primary font-mono"
                textAnchor="middle"
              >
                {distances[node.id] === Infinity ? '∞' : `d=${distances[node.id]}`}
              </text>
            )}
            {/* Order label for BFS/DFS */}
            {(algorithm === 'bfs' || algorithm === 'dfs') && discoveryOrder.includes(node.id) && (
              <text
                x={node.x}
                y={node.y - 40}
                className="text-xs fill-gray-500 dark:fill-gray-400 font-mono"
                textAnchor="middle"
              >
                {discoveryOrder.indexOf(node.id) + 1}
              </text>
            )}
          </motion.g>
        ))}
      </svg>

      {/* BFS/DFS Queue/Stack Display */}
      {(algorithm === 'bfs' || algorithm === 'dfs') && (queue.length > 0 || stack.length > 0) && (
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 p-2 rounded-lg text-xs">
          {algorithm === 'bfs' && (
            <div>
              <span className="font-semibold">Queue:</span> {' '}
              {queue.map(id => graph.nodes[id]?.label).join(' → ') || 'empty'}
            </div>
          )}
          {algorithm === 'dfs' && (
            <div>
              <span className="font-semibold">Stack:</span> {' '}
              {stack.map(id => graph.nodes[id]?.label).join(' → ') || 'empty'}
            </div>
          )}
        </div>
      )}

      {/* Floyd-Warshall Matrix Display */}
      {algorithm === 'floyd' && matrix && (
        <div className="absolute bottom-2 right-4 bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg text-xs max-w-xs">
          <div className="font-semibold mb-2 text-center">Distance Matrix</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${graph.nodes.length}, 1fr)` }}>
            {/* Header row */}
            <div className="p-1"></div>
            {graph.nodes.map(n => (
              <div key={n.id} className="p-1 font-bold text-center">{n.label}</div>
            ))}
            {/* Matrix rows */}
            {matrix.map((row, rIdx) => (
              <React.Fragment key={rIdx}>
                <div className="p-1 font-bold">{graph.nodes[rIdx].label}</div>
                {row.map((val, cIdx) => {
                  let cellClass = "bg-gray-50 dark:bg-slate-700";
                  // Highlight active cell being checked
                  if (activeTriplet.length === 3 && activeTriplet[0] === rIdx && activeTriplet[2] === cIdx) {
                    cellClass = "bg-purple-200 dark:bg-purple-900 font-bold";
                  }
                  return (
                    <div key={cIdx} className={`p-1 text-center border dark:border-slate-600 rounded ${cellClass}`}>
                      {val === Infinity ? '∞' : val}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphBoard;
