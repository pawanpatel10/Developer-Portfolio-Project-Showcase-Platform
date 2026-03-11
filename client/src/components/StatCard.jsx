const StatCard = ({ label, value, accent }) => {
  return (
    <div className="card stat-card">
      <span className="eyebrow">{label}</span>
      <strong style={{ color: accent }}>{value}</strong>
    </div>
  );
};

export default StatCard;
