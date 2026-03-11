import React from 'react';

const Stepper = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`stepper-container ${className}`}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <div key={index} className={`stepper-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
            <div className="stepper-icon">
              {isCompleted ? '✓' : index + 1}
            </div>
            <div className="stepper-label">{step}</div>
            {index < steps.length - 1 && <div className="stepper-line" />}
          </div>
        );
      })}
      
      <style>{`
        .stepper-container {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: var(--spacing-xl);
          position: relative;
        }
        
        .stepper-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          flex: 1;
        }
        
        .stepper-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--color-text-secondary);
          transition: all 0.3s ease;
          margin-bottom: 8px;
          position: relative;
          z-index: 2;
        }
        
        .stepper-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          text-align: center;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .stepper-line {
          position: absolute;
          top: 18px;
          left: calc(50% + 18px);
          width: calc(100% - 36px);
          height: 2px;
          background: var(--color-border);
          z-index: 1;
          transition: all 0.3s ease;
        }
        
        /* Active State */
        .stepper-step.active .stepper-icon {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
          box-shadow: 0 0 0 4px var(--color-primary-dim);
        }
        
        .stepper-step.active .stepper-label {
          color: var(--color-primary);
          font-weight: 600;
        }
        
        /* Completed State */
        .stepper-step.completed .stepper-icon {
          background: var(--color-success);
          border-color: var(--color-success);
          color: white;
        }
        
        .stepper-step.completed .stepper-label {
          color: var(--color-text-primary);
        }
        
        .stepper-step.completed .stepper-line {
          background: var(--color-success);
        }
      `}</style>
    </div>
  );
};

export default Stepper;
