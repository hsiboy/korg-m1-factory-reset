const Alert = ({ className, variant = "default", children, ...props }) => {
  const variantStyles = {
    default: "bg-gray-100 text-gray-900",
    destructive: "bg-red-100 text-red-900",
  };

  return (
    <div
      role="alert"
      className={`
        relative w-full rounded-lg border p-4
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ className, children, ...props }) => {
  return (
    <h5
      className={`mb-1 font-medium leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </h5>
  );
};

const AlertDescription = ({ className, children, ...props }) => {
  return (
    <div
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription };
