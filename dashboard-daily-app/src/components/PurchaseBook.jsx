const PurchaseBook = ({ onNavigate }) => {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => onNavigate('dashboard')}>
            ← Back to Dashboard
          </button>
          <h2>Purchase Book</h2>
          <p>Purchase Management - Coming Soon</p>
        </div>
      </div>
    );
  };
  
  export default PurchaseBook;