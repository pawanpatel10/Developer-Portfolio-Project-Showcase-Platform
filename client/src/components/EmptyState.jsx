const EmptyState = ({ title, description }) => {
  return (
    <div className="card empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default EmptyState;
