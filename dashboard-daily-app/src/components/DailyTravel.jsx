const DailyTravel = ({ onNavigate }) => {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            ← Back to Dashboard
          </button>
          <h2>Daily Travel Log</h2>
          <p>Travel Management - Coming Soon</p>
        </div>
      </div>
    );
  };
  
  export default DailyTravel;