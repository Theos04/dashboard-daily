import { useState } from 'react';

const Inventory = ({ onNavigate }) => {
  const [inventory] = useState([
    { id: 1, name: 'Medicine A', sku: 'MED001', quantity: 150, price: 25.99, category: 'Pharmaceutical' },
    { id: 2, name: 'Medicine B', sku: 'MED002', quantity: 89, price: 45.50, category: 'Pharmaceutical' },
  ]);

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Inventory Management</h2>
          <button className="btn btn-primary">Add Product</button>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>
                    <span className={`status-badge ${item.quantity < 100 ? 'status-pending' : 'status-active'}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>${item.price}</td>
                  <td>{item.category}</td>
                  <td>
                    <button className="btn btn-secondary" style={{padding: '0.5rem'}}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;