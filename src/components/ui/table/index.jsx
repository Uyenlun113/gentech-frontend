// Table Component
const Table = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow = ({ children, className, onClick }) => {
  return (
    <tr className={className} onClick={onClick}>
      {children}
    </tr>
  );
};

// TableCell Component
const TableCell = ({ children, isHeader = false, className, style }) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag style={style} className={` ${className}`}>
      {children}
    </CellTag>
  );
};

export { Table, TableBody, TableCell, TableHeader, TableRow };
