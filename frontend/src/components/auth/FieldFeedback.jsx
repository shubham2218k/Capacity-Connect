import { AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

/**
 * FieldFeedback: Field-level error messages, summary alerts, and key verification badges.
 */
export const FieldFeedback = ({ error, success, helper }) => {
  if (error) {
    return (
      <div className="cc-field-error" role="alert">
        <XCircle size={14} />
        <span>{error}</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="cc-field-success">
        <CheckCircle size={14} />
        <span>{success}</span>
      </div>
    );
  }

  if (helper) {
    return <div className="cc-field-helper">{helper}</div>;
  }

  return null;
};

/**
 * FormAlertBanner: Top-level error/notice banner.
 */
export const FormAlertBanner = ({ error, id = 'form-error-banner' }) => {
  if (!error) return null;

  return (
    <div id={id} className="cc-alert-error" role="alert" aria-live="polite" tabIndex={-1}>
      <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <strong style={{ display: 'block', marginBottom: '2px' }}>Submission Error</strong>
        <span>{error}</span>
      </div>
    </div>
  );
};

/**
 * AccessKeyStatusBadge: Organization verification badge.
 */
export const AccessKeyStatusBadge = ({ isValidating, isVerified, organizationName, keyError }) => {
  if (isValidating) {
    return (
      <div className="cc-key-status-badge cc-key-status-validating" aria-live="polite">
        <Loader2 size={14} className="cc-spinner" style={{ borderTopColor: '#22d3ee', borderWidth: '1.5px' }} />
        <span>Verifying access key...</span>
      </div>
    );
  }

  if (isVerified && organizationName) {
    return (
      <div className="cc-key-status-badge cc-key-status-verified" aria-live="polite">
        <CheckCircle size={14} />
        <span>Organization verified: <strong>{organizationName}</strong></span>
      </div>
    );
  }

  if (keyError) {
    return (
      <div className="cc-key-status-badge cc-key-status-invalid" aria-live="polite">
        <XCircle size={14} />
        <span>{keyError}</span>
      </div>
    );
  }

  return null;
};

