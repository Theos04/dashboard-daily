const Reports = ({ onNavigate }) => {
  return (
    <div className="page-container">
      <div className="card">
        <h2 className="card-title">Reports & Analytics</h2>
        <div className="grid grid-cols-2">
          <div className="card">
            <h3>Sales Report</h3>
            <p>Monthly sales performance</p>
          </div>
          <div className="card">
            <h3>Inventory Report</h3>
            <p>Stock levels and alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;