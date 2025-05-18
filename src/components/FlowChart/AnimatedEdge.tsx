import React, { useEffect, useState } from 'react';
import { EdgeProps, getBezierPath, getSmoothStepPath, EdgeLabelRenderer } from 'reactflow';
import { motion } from 'framer-motion';

// Extended interface to include the missing properties
interface AnimatedEdgeProps extends EdgeProps {
  sourceHandle?: string | null;
  targetHandle?: string | null;
  style?: {
    strokeWidth?: string | number;
    strokeDasharray?: string;
    [key: string]: any;
  };
}

const AnimatedEdge: React.FC<AnimatedEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {} as AnimatedEdgeProps['style'],
  data,
  markerEnd,
  sourceHandle,
  targetHandle,
}) => {
  const [edgePathLength, setEdgePathLength] = useState(0);
  const [pathRef, setPathRef] = useState<SVGPathElement | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Determine if this is a vertical or horizontal connection
  const isVertical = !sourceHandle && !targetHandle;

  // Get the path for the edge
  const [edgePath, labelX, labelY] = isVertical
    ? getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 16,
      })
    : getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });

  // Calculate the path length for animation
  useEffect(() => {
    if (pathRef) {
      const length = pathRef.getTotalLength();
      setEdgePathLength(length);

      // Start animation after a short delay
      setTimeout(() => {
        setIsAnimated(true);
      }, 100);
    }

    // Reset animation state when component unmounts
    return () => {
      setIsAnimated(false);
    };
  }, [pathRef]);

  return (
    <>
      <path
        id={id}
        ref={setPathRef}
        style={{
          ...style,
          strokeWidth: style?.strokeWidth || 2,
          strokeDasharray: style?.strokeDasharray || 'none',
          stroke: data?.color || '#b1b1b7',
          fill: 'none',
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />

      {/* Animated path overlay */}
      {edgePathLength > 0 && (
        <motion.path
          d={edgePath}
          fill="none"
          stroke={data?.color || '#1a56db'}
          strokeWidth={style?.strokeWidth ? Number(style.strokeWidth) + 1 : 3}
          strokeDasharray={style?.strokeDasharray || 'none'}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isAnimated ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      )}

      {/* Edge Label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 14,
              pointerEvents: 'all',
            }}
            className="px-2 py-1 bg-white rounded-md shadow-sm border border-gray-200 text-xs"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default AnimatedEdge;
