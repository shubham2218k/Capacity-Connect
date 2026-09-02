import { Check } from 'lucide-react';

/**
 * FormProgress: Editorial chapter markers / numbered stamps progress indicator.
 * Desktop: Chapter stamps with solid rules & checkmarks.
 * Mobile: Step X of Y title with a compact progress line.
 */
export const FormProgress = ({ steps = [], currentStep = 1, onStepClick }) => {
  const totalSteps = steps.length;
  const progressPercent = Math.min(100, Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <>
      {/* Desktop Stepper */}
      <nav className="cc-stepper" aria-label="Form Progress Steps">
        <div className="cc-stepper-track">
          <div className="cc-stepper-progress" style={{ width: `${progressPercent}%` }} />
        </div>

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          const isClickable = onStepClick && stepNum < currentStep;

          return (
            <div
              key={step.title || stepNum}
              className={`cc-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <button
                type="button"
                className="cc-step-button"
                onClick={() => isClickable && onStepClick(stepNum)}
                disabled={!isClickable}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${stepNum}: ${step.title}`}
              >
                <div className="cc-step-bubble">
                  {isCompleted ? <Check size={18} strokeWidth={3} /> : stepNum}
                </div>
                <span className="cc-step-label">{step.title}</span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* Mobile Stepper Header */}
      <div className="cc-stepper-mobile" aria-label={`Step ${currentStep} of ${totalSteps}`}>
        <div className="cc-stepper-mobile-info">
          <span>Step {currentStep} of {totalSteps}</span>
          <span style={{ color: 'var(--cc-cyan)' }}>{steps[currentStep - 1]?.title}</span>
        </div>
        <div className="cc-stepper-mobile-bar">
          <div className="cc-stepper-mobile-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
        </div>
      </div>
    </>
  );
};
