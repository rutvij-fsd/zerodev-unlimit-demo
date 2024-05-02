import React from "react";
import "./loading.css"; // Import the CSS file for styling

interface LoadingProps {
  isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps) => {
  if (!isLoading) return null;

  return (
    <div className="loading-container">
      <div className="loading-circle"></div>
    </div>
  );
};

export default Loading;