import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';

// Custom node components
import StudentNode from './StudentNode';
import AdminNode from './AdminNode';
import DataNode from './DataNode';
import SystemNode from './SystemNode';

// Custom edge
import AnimatedEdge from './AnimatedEdge';

// Import the initial nodes and edges
import { initialNodes, initialEdges } from './flowChartData';

// Define custom node types
const nodeTypes: NodeTypes = {
  studentNode: StudentNode,
  adminNode: AdminNode,
  dataNode: DataNode,
  systemNode: SystemNode,
};

// Define custom edge types
const edgeTypes = {
  animated: AnimatedEdge,
};

interface FlowChartProps {
  className?: string;
}

const FlowChart: React.FC<FlowChartProps> = ({ className }) => {
  // Initialize nodes and edges with the initial data
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the flowchart with a staggered animation
  useEffect(() => {
    // Reset and start animation on component mount
    setIsInitialized(true);

    // Start with empty arrays
    setNodes([]);
    setEdges([]);

    // Begin animation sequence with a slight delay
    setTimeout(() => {
      startAnimation();
    }, 300);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to start the animation sequence
  const startAnimation = useCallback(() => {
    // Clear any existing nodes and edges
    setNodes([]);
    setEdges([]);

    // Set animation state
    setIsAnimating(true);
    setAnimationStep(0);

    // Animate nodes first, then edges
    const nodeAnimationDuration = 100; // ms per node

    // Add nodes one by one with a delay
    initialNodes.forEach((node, index) => {
      setTimeout(() => {
        setNodes((prevNodes) => [...prevNodes, { ...node, animated: true }]);

        // When all nodes are added, start adding edges
        if (index === initialNodes.length - 1) {
          setTimeout(() => {
            // Add edges one by one with a delay
            initialEdges.forEach((edge, edgeIndex) => {
              setTimeout(() => {
                setEdges((prevEdges) => [...prevEdges, edge]);

                // When all edges are added, finish animation
                if (edgeIndex === initialEdges.length - 1) {
                  setTimeout(() => {
                    setIsAnimating(false);
                  }, 500);
                }
              }, edgeIndex * 50); // 50ms delay between each edge
            });
          }, 500); // Wait 500ms after all nodes are added
        }
      }, index * nodeAnimationDuration);
    });
  }, []);

  // Filter nodes and edges based on active category
  useEffect(() => {
    if (!activeCategory) {
      // If no category is selected, show all nodes and edges
      setNodes(initialNodes);
      setEdges(initialEdges);
      return;
    }

    // Filter nodes by category
    const filteredNodes = initialNodes.filter(
      (node) => node.data.category === activeCategory || node.data.category === 'core'
    );

    // Get the IDs of the filtered nodes
    const nodeIds = filteredNodes.map((node) => node.id);

    // Filter edges that connect the filtered nodes
    const filteredEdges = initialEdges.filter(
      (edge) => nodeIds.includes(edge.source) && nodeIds.includes(edge.target)
    );

    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [activeCategory]);

  // Reset animation handler
  const handleResetAnimation = () => {
    // Don't allow reset while animation is already running
    if (isAnimating) return;

    // Reset category filter
    setActiveCategory(null);

    // Start animation
    startAnimation();
  };

  // Category filter handler
  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(category);
  };

  return (
    <motion.div
      className={`w-full h-[1150px] rounded-lg shadow-lg border border-gray-200 pb-16 flowchart-container ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.2,
          maxZoom: 1.5
        }}
        attributionPosition="bottom-right"
        defaultEdgeOptions={{
          type: 'animated',
          style: { strokeWidth: 2 },
        }}
        nodesDraggable={true}
        nodesConnectable={false}
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.35 }}
      >
        <Background />
        <Controls />
        <MiniMap />

        <Panel position="top-left" className="bg-white p-2 rounded-md shadow-md">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Filter by Category:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-2 py-1 text-xs rounded-md ${
                  activeCategory === null
                    ? 'bg-nbkr text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryFilter(null)}
              >
                All
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-md ${
                  activeCategory === 'student'
                    ? 'bg-nbkr text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryFilter('student')}
              >
                Student Flow
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-md ${
                  activeCategory === 'admin'
                    ? 'bg-nbkr text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryFilter('admin')}
              >
                Admin Flow
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-md ${
                  activeCategory === 'data'
                    ? 'bg-nbkr text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryFilter('data')}
              >
                Data Flow
              </button>
            </div>
            <button
              className="mt-2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center"
              onClick={handleResetAnimation}
              disabled={isAnimating}
            >
              {isAnimating ? 'Animating...' : 'Replay Animation'}
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </motion.div>
  );
};

export default FlowChart;
