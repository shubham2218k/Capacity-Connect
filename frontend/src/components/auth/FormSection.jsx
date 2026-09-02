export const FormSection = ({
  title,
  icon: Icon,
  description,
  children,
  highlight = false,
  className = ''
}) => {
  return (
    <section className={`cc-auth-card ${highlight ? 'cc-auth-card-highlight' : ''} ${className}`}>
      {title && (
        <header className="cc-form-section-header">
          <h3 className="cc-form-section-title">
            {Icon && (
              <span className="cc-form-section-icon" aria-hidden="true">
                <Icon size={20} />
              </span>
            )}
            <span>{title}</span>
          </h3>
        </header>
      )}

      {description && <p className="cc-form-section-desc">{description}</p>}

      {children}
    </section>
  );
};

