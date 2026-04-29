const VisitsBook = ({ onNavigate }) => {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            ← Back to Dashboard
          </button>
          <h2>Visits Book</h2>
          <p>Visits Management - Coming Soon</p>
        </div>
      </div>
    );
  };
  
  export default VisitsBook;