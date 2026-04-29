import { useState, useEffect } from 'react';
import { useMobile } from '../hooks/useMobile';
import './../styles/components.css';

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    todayVisits: 0,
    pendingSales: 0,
    upcomingEvents: 0
  });
  const isMobile = useMobile();

  // Mock data - replace with actual API calls later
  useEffect(() => {
    // This will be replaced with real data from your Flask backend
    setStats({
      totalContacts: 156,
      todayVisits: 12,
      pendingSales: 8,
      upcomingEvents: 5
    });
  }, []);

  const menuItems = [
    { 
      id: 'crm-book', 
      icon: '👥', 
      title: 'CRM Book', 
      description: 'Manage customer relationships and contacts',
      color: '#3b82f6'
    },
    { 
      id: 'purchase-book', 
      icon: '🛒', 
      title: 'Purchase Book', 
      description: 'Track purchase orders and inventory',
      color: '#10b981'
    },
    { 
      id: 'sales-book', 
      icon: '💰', 
      title: 'Sales Book', 
      description: 'Record sales and analyze performance',
      color: '#f59e0b'
    },
    { 
      id: 'daily-travel', 
      icon: '🚗', 
      title: 'Daily Travel Log', 
      description: 'Log travel records and expenses',
      color: '#ef4444'
    },
    { 
      id: 'visits-book', 
      icon: '🏢', 
      title: 'Visits Book', 
      description: 'Track customer visits and meetings',
      color: '#8b5cf6'
    },
    { 
      id: 'calendar', 
      icon: '📅', 
      title: 'Calendar', 
      description: 'Schedule and manage appointments',
      color: '#06b6d4'
    },
  ];

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>Business Dashboard</h1>
        <p>Manage your daily business operations efficiently</p>
        <div className="current-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalContacts}</div>
            <div className="stat-label">Total Contacts</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <div className="stat-value">{stats.todayVisits}</div>
            <div className="stat-label">Today's Visits</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingSales}</div>
            <div className="stat-label">Pending Sales</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.upcomingEvents}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>
        </div>
      </div>

      {/* Main Navigation Grid */}
      <div className="section-title">
        <h2>Business Modules</h2>
        <p>Access different parts of your business management system</p>
      </div>
      
      <div className={`modules-grid ${isMobile ? 'mobile-grid' : 'desktop-grid'}`}>
        {menuItems.map(item => (
          <div 
            key={item.id}
            className="module-card"
            onClick={() => onNavigate(item.id)}
            style={{ '--card-color': item.color }}
          >
            <div className="module-icon" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <div className="module-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="module-arrow">
                <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">➕</div>
            <div className="activity-details">
              <span className="activity-text">New contact added: John Doe</span>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📅</div>
            <div className="activity-details">
              <span className="activity-text">Meeting scheduled with ABC Corp</span>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-details">
              <span className="activity-text">Sale completed: ₹25,000</span>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;