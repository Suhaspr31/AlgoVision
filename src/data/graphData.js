/**
 * Sample Graph Data
 * Used for graph algorithm visualizations
 */

export const SAMPLE_GRAPH = {
  nodes: [
    { id: 0, label: 'A', x: 100, y: 200 },
    { id: 1, label: 'B', x: 250, y: 100 },
    { id: 2, label: 'C', x: 250, y: 300 },
    { id: 3, label: 'D', x: 400, y: 100 },
    { id: 4, label: 'E', x: 400, y: 300 },
    { id: 5, label: 'F', x: 550, y: 200 },
  ],
  edges: [
    { source: 0, target: 1, weight: 4 },
    { source: 0, target: 2, weight: 2 },
    { source: 1, target: 2, weight: 1 },
    { source: 1, target: 3, weight: 5 },
    { source: 2, target: 3, weight: 8 },
    { source: 2, target: 4, weight: 10 },
    { source: 3, target: 4, weight: 2 },
    { source: 3, target: 5, weight: 6 },
    { source: 4, target: 5, weight: 3 },
  ]
};

// Convert SAMPLE_GRAPH to the format used by existing algorithms (from, to instead of source, target)
export const getDefaultGraph = () => {
  return {
    nodes: [...SAMPLE_GRAPH.nodes],
    edges: SAMPLE_GRAPH.edges.map(e => ({
      from: e.source,
      to: e.target,
      weight: e.weight
    }))
  };
};
