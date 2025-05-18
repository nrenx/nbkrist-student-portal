import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { Database, Server, HardDrive, FileJson } from 'lucide-react';

interface DataNodeData {
  label: string;
  description: string;
  icon?: string;
  category: string;
}

const DataNode: React.FC<NodeProps<DataNodeData>> = ({ data, isConnectable }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine which icon to use
  const getIcon = () => {
    switch (data.icon) {
      case 'server':
        return <Server className="w-5 h-5 text-purple-600" />;
      case 'storage':
        return <HardDrive className="w-5 h-5 text-purple-600" />;
      case 'json':
        return <FileJson className="w-5 h-5 text-purple-600" />;
      default:
        return <Database className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <div
        className="px-5 py-4 rounded-lg shadow-md bg-white border-2 border-purple-200 cursor-pointer min-w-[200px]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 rounded-full">
            {getIcon()}
          </div>
          <div>
            <div className="font-semibold text-base">{data.label}</div>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-gray-600 mt-2 max-w-[200px]"
              >
                {data.description}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400"
      />
      {/* Additional handles for horizontal connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-400"
      />
    </motion.div>
  );
};

export default DataNode;
