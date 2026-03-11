import React, { useState } from 'react';

export const Tabs = ({ defaultActive, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultActive);

  return (
    <div className={className}>
      <div className="tabs-nav">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          return (
            <button
              className={`tab-btn ${activeTab === child.props.value ? 'active' : ''}`}
              onClick={() => setActiveTab(child.props.value)}
            >
              {child.props.label}
            </button>
          );
        })}
      </div>
      <div className="tabs-content">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          if (child.props.value !== activeTab) return null;
          return child;
        })}
      </div>
    </div>
  );
};

export const TabPanel = ({ children, className = '' }) => {
  return <div className={`animate-fade-in ${className}`}>{children}</div>;
};
