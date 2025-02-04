import React from 'react';
import { Loader } from 'lucide-react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner-overlay">
      <Loader className="loading-spinner" />
    </div>
  );
};

export default LoadingSpinner;