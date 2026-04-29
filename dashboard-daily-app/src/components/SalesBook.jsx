const SalesBook = ({ onNavigate }) => {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            ← Back to Dashboard
          </button>
          <h2>Sales Book</h2>
          <p>Sales Management - Coming Soon</p>
        </div>
      </div>
    );
  };
  
  export default SalesBook;