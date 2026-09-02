/**
 * AnimatedActionButton: Tactile editorial button.
 * Solid coral fill, deep plum border, 8px radius, tactile offset shadow, hover lift & press states.
 */
export const AnimatedActionButton = ({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  loadingText,
  icon: Icon,
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
  style = {},
  ...rest
}) => {
  const variantClass = `cc-btn-${variant}`;
  const widthStyle = fullWidth ? { width: '100%' } : {};

  return (
    <button
      type={type}
      className={`cc-btn ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? 'true' : undefined}
      style={{ ...widthStyle, ...style }}
      {...rest}
    >
      {isLoading ? (
        <>
          <div className="cc-spinner" aria-hidden="true" />
          <span>{loadingText || 'Processing...'}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {Icon && (
            <span className="cc-btn-icon" aria-hidden="true">
              <Icon size={18} />
            </span>
          )}
        </>
      )}
    </button>
  );
};
