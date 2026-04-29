import { useState, useRef, useEffect } from 'react';
import { useMobile } from './hooks/useMobile';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import your existing components
import Dashboard from './components/Dashboard';
import CrmBook from './components/CrmBook';
import PurchaseBook from './components/PurchaseBook';
import SalesBook from './components/SalesBook';
import DailyTravel from './components/DailyTravel';
import VisitsBook from './components/VisitsBook';
import Calendar from './components/Calendar';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import Settings from './components/Settings';

import './App.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [activeSection, setActiveSection] = useState('erp');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevModule, setPrevModule] = useState('dashboard');
  const [notifications] = useState(3);
  const isMobile = useMobile();

  // Refs for GSAP animations
  const appRef = useRef();
  const sidebarRef = useRef();
  const mainContentRef = useRef();
  const headerRef = useRef();
  const mobileSidebarRef = useRef();
  const mobileOverlayRef = useRef();
  const mobileBottomNavRef = useRef();
  const breadcrumbRef = useRef();
  const headerActionsRef = useRef();

  // Enhanced Navigation Structure
  const navigationStructure = {
    erp: {
      id: 'erp',
      title: 'ERP Modules',
      icon: '🏢',
      modules: [
        { id: 'dashboard', title: 'Dashboard', icon: '📊', color: '#3B82F6' },
        { id: 'purchase-book', title: 'Purchase Orders', icon: '🛒', color: '#F59E0B' },
        { id: 'sales-book', title: 'Sales Management', icon: '💰', color: '#10B981' },
        { id: 'inventory', title: 'Inventory Control', icon: '📦', color: '#8B5CF6' },
        { id: 'reports', title: 'Analytics & Reports', icon: '📈', color: '#EC4899' },
      ]
    },
    crm: {
      id: 'crm',
      title: 'CRM Modules',
      icon: '🤝',
      modules: [
        { id: 'crm-book', title: 'Customer Database', icon: '👥', color: '#6366F1' },
        { id: 'visits-book', title: 'Field Visits', icon: '🏢', color: '#14B8A6' },
        { id: 'daily-travel', title: 'Travel Log', icon: '🚗', color: '#F97316' },
        { id: 'calendar', title: 'Schedule Calendar', icon: '📅', color: '#EF4444' }
      ]
    },
    system: {
      id: 'system',
      title: 'System Administration',
      icon: '⚙️',
      modules: [
        { id: 'settings', title: 'System Settings', icon: '⚙️', color: '#64748B' }
      ]
    }
  };

  // Business Metrics Data
  const businessMetrics = {
    overview: [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: '₹4,56,780',
        target: '₹5,00,000',
        growth: 15.2,
        trend: 'up',
        icon: '📈',
        color: '#10B981'
      },
      {
        id: 'sales',
        title: 'Sales Orders',
        value: '₹1,25,430',
        target: '₹1,50,000',
        growth: 12.5,
        trend: 'up',
        icon: '💰',
        color: '#3B82F6'
      },
      {
        id: 'inventory',
        title: 'Stock Value',
        value: '₹89,450',
        target: '₹75,000',
        growth: 17.3,
        trend: 'up',
        icon: '📦',
        color: '#8B5CF6'
      },
      {
        id: 'customers',
        title: 'Active Customers',
        value: '1,247',
        target: '1,200',
        growth: 3.9,
        trend: 'up',
        icon: '👥',
        color: '#EC4899'
      },
      {
        id: 'visits',
        title: 'Completed Visits',
        value: '89',
        target: '100',
        growth: 8.9,
        trend: 'up',
        icon: '🏢',
        color: '#F59E0B'
      },
      {
        id: 'efficiency',
        title: 'Process Efficiency',
        value: '92%',
        target: '95%',
        growth: 2.4,
        trend: 'up',
        icon: '⚡',
        color: '#14B8A6'
      }
    ],
    quickActions: [
      {
        id: 'new-sale',
        title: 'Create Invoice',
        description: 'Generate new sales invoice',
        icon: '📄',
        color: '#10B981',
        action: () => navigateToModule('sales-book')
      },
      {
        id: 'add-customer',
        title: 'Add Customer',
        description: 'Register new client',
        icon: '👤',
        color: '#3B82F6',
        action: () => navigateToModule('crm-book')
      },
      {
        id: 'stock-check',
        title: 'Stock Check',
        description: 'View inventory levels',
        icon: '📋',
        color: '#8B5CF6',
        action: () => navigateToModule('inventory')
      },
      {
        id: 'schedule-visit',
        title: 'Plan Visit',
        description: 'Schedule field visit',
        icon: '📍',
        color: '#F59E0B',
        action: () => navigateToModule('visits-book')
      }
    ]
  };

  // Navigation Handler
  const navigateToModule = (moduleId) => {
    // Animate navigation item
    const navItem = document.querySelector(`[data-module="${moduleId}"]`);
    if (navItem) {
      gsap.to(navItem, {
        duration: 0.15,
        scale: 0.95,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }

    // Find which section this module belongs to
    Object.keys(navigationStructure).forEach(sectionKey => {
      if (navigationStructure[sectionKey].modules.some(m => m.id === moduleId)) {
        setActiveSection(sectionKey);
      }
    });

    // Handle module change with transition
    if (prevModule !== moduleId) {
      animateModuleChange(moduleId, prevModule);
      setPrevModule(moduleId);
    }

    setCurrentModule(moduleId);
    
    if (isMobile) {
      setMobileMenuOpen(false);
    }
    
    // Refresh scroll animations
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  // Animation functions
  const animatePageIn = () => {
    const ctx = gsap.context(() => {
      const masterTL = gsap.timeline();

      // Sidebar animations (desktop)
      if (!isMobile && sidebarRef.current) {
        masterTL.from(sidebarRef.current, {
          duration: 0.8,
          x: -100,
          opacity: 0,
          ease: "power3.out"
        }, 0);

        masterTL.from('.sidebar-nav .nav-section', {
          duration: 0.6,
          y: 30,
          opacity: 0,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }, 0.3);

        masterTL.from('.sidebar-nav .nav-item', {
          duration: 0.5,
          x: -20,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out"
        }, 0.5);
      }

      // Header animations
      masterTL.from(headerRef.current, {
        duration: 0.7,
        y: -80,
        opacity: 0,
        rotationX: -15,
        transformOrigin: "top",
        ease: "power3.out"
      }, 0.2);

      // Breadcrumb animation
      masterTL.from(breadcrumbRef.current, {
        duration: 0.6,
        x: -30,
        opacity: 0,
        ease: "power2.out"
      }, 0.4);

      // Header actions animation
      masterTL.from(headerActionsRef.current?.children || [], {
        duration: 0.5,
        x: 30,
        opacity: 0,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }, 0.5);

      // Main content animation
      masterTL.from(mainContentRef.current, {
        duration: 0.8,
        opacity: 0,
        y: 50,
        scale: 0.95,
        ease: "power3.out"
      }, 0.3);

      // Mobile bottom nav animation
      if (isMobile && mobileBottomNavRef.current) {
        masterTL.from(mobileBottomNavRef.current, {
          duration: 0.6,
          y: 100,
          opacity: 0,
          ease: "bounce.out"
        }, 0.6);

        masterTL.from('.mobile-bottom-nav .nav-btn', {
          duration: 0.4,
          y: 20,
          opacity: 0,
          stagger: 0.1,
          ease: "power2.out"
        }, 0.8);
      }

      // KPI Cards entrance animation
      masterTL.from('.kpi-widget', {
        duration: 0.8,
        y: 60,
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, 0.8);

      return masterTL;
    }, appRef);

    return ctx;
  };

  const animateModuleChange = (newModule, oldModule) => {
    const ctx = gsap.context(() => {
      const changeTL = gsap.timeline();

      // Outgoing animation
      changeTL.to('.app-main > *', {
        duration: 0.3,
        opacity: 0,
        x: newModule > oldModule ? -50 : 50,
        scale: 0.95,
        ease: "power2.in"
      });

      // Active nav item highlight animation
      const activeNavItem = document.querySelector(`[data-module="${newModule}"]`);
      if (activeNavItem) {
        changeTL.fromTo(activeNavItem,
          {
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            scale: 1
          },
          {
            duration: 0.4,
            scale: 1.05,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
            ease: "back.out(1.7)",
            clearProps: "all"
          },
          0
        );
      }

      // Breadcrumb update animation
      changeTL.fromTo(breadcrumbRef.current,
        { scale: 0.8, opacity: 0 },
        {
          duration: 0.4,
          scale: 1,
          opacity: 1,
          ease: "back.out(1.7)"
        },
        0.3
      );

      // Incoming animation
      changeTL.fromTo('.app-main > *',
        {
          opacity: 0,
          x: newModule > oldModule ? 50 : -50,
          scale: 1.05
        },
        {
          duration: 0.5,
          opacity: 1,
          x: 0,
          scale: 1,
          ease: "power3.out"
        },
        0.3
      );

      return changeTL;
    }, appRef);

    return ctx;
  };

  const animateMobileMenu = (show) => {
    const ctx = gsap.context(() => {
      const menuTL = gsap.timeline();

      if (show) {
        menuTL.fromTo(mobileOverlayRef.current,
          { opacity: 0 },
          {
            duration: 0.3,
            opacity: 1,
            ease: "power2.out"
          }
        );

        menuTL.fromTo(mobileSidebarRef.current,
          { x: -350 },
          {
            duration: 0.4,
            x: 0,
            ease: "power3.out"
          },
          0
        );

        menuTL.from('.mobile-sidebar-nav .nav-section', {
          duration: 0.5,
          y: 30,
          opacity: 0,
          stagger: 0.15,
          ease: "back.out(1.7)"
        }, 0.2);

        menuTL.from('.mobile-sidebar-nav .nav-item', {
          duration: 0.4,
          x: -20,
          opacity: 0,
          stagger: 0.08,
          ease: "power2.out"
        }, 0.3);
      } else {
        menuTL.to('.mobile-sidebar-nav .nav-item', {
          duration: 0.2,
          x: -20,
          opacity: 0,
          stagger: 0.05,
          ease: "power2.in"
        });

        menuTL.to(mobileSidebarRef.current, {
          duration: 0.3,
          x: -350,
          ease: "power3.in"
        }, 0.1);

        menuTL.to(mobileOverlayRef.current, {
          duration: 0.2,
          opacity: 0,
          ease: "power2.in"
        }, 0.1);
      }

      return menuTL;
    }, appRef);

    return ctx;
  };

  const setupScrollAnimations = () => {
    const ctx = gsap.context(() => {
      // Animate KPI cards on scroll
      gsap.utils.toArray('.kpi-widget').forEach((card, index) => {
        gsap.fromTo(card,
          {
            y: 60,
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animate charts and graphs
      gsap.utils.toArray('.chart-container').forEach(chart => {
        gsap.fromTo(chart,
          {
            x: -50,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chart,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animate data tables
      gsap.utils.toArray('.data-table').forEach(table => {
        gsap.fromTo(table.querySelectorAll('tr'),
          {
            y: 20,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: table,
              start: "top 75%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }, appRef);

    return ctx;
  };

  // Enhanced Dashboard Component
  const EnhancedDashboard = () => (
    <div className="dashboard-container">
      {/* KPI Section */}
      <div className="kpi-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Key Performance Indicators</h2>
            <p className="section-subtitle">Real-time business metrics and analytics</p>
          </div>
          <div className="section-actions">
            <button className="btn btn-secondary">View Details</button>
          </div>
        </div>
        <div className="kpi-grid">
          {businessMetrics.overview.map((metric, index) => (
            <div 
              key={metric.id} 
              className={`kpi-widget ${metric.id}`}
              style={{ '--kpi-color': metric.color }}
              data-delay={index}
            >
              <div className="kpi-header">
                <div className="kpi-title-group">
                  <div className="kpi-icon" style={{ backgroundColor: metric.color }}>
                    {metric.icon}
                  </div>
                  <div>
                    <h3 className="kpi-title">{metric.title}</h3>
                    <div className="kpi-trend positive">
                      <span>{metric.trend === 'up' ? '↗' : '↘'}</span>
                      <span>{metric.growth}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kpi-value">{metric.value}</div>
              <div className="kpi-subtext">Target: {metric.target}</div>
              <div className="kpi-progress">
                <div className="progress-label">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          {businessMetrics.quickActions.map(action => (
            <button 
              key={action.id} 
              className="action-card"
              onClick={action.action}
            >
              <div className="action-icon" style={{ background: action.color }}>
                {action.icon}
              </div>
              <div className="action-content">
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Recent Activity</h2>
            <p className="section-subtitle">Latest updates across the system</p>
          </div>
          <button className="btn btn-secondary">View All</button>
        </div>
        <div className="activity-feed">
          {[
            { action: 'New sale recorded', amount: '₹25,000', time: '2 min ago', type: 'sale' },
            { action: 'Inventory updated', items: '45 items', time: '5 min ago', type: 'inventory' },
            { action: 'Customer visit completed', customer: 'MediCorp Ltd', time: '1 hour ago', type: 'visit' },
            { action: 'Purchase order created', amount: '₹18,750', time: '2 hours ago', type: 'purchase' },
            { action: 'New customer registered', customer: 'HealthPlus Pharma', time: '3 hours ago', type: 'customer' }
          ].map((activity, index) => (
            <div key={index} className={`activity-item ${activity.type}`}>
              <div className="activity-icon-container">
                {activity.type === 'sale' ? '💰' : 
                 activity.type === 'inventory' ? '📦' : 
                 activity.type === 'visit' ? '🏢' : 
                 activity.type === 'purchase' ? '🛒' : '👥'}
              </div>
              <div className="activity-details">
                <h3 className="activity-title">{activity.action}</h3>
                <div className="activity-meta">
                  <span className="activity-info">
                    {activity.amount || activity.items || activity.customer}
                  </span>
                  <span className="activity-time">
                    <span>•</span>
                    <span>{activity.time}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentModule = () => {
    const moduleProps = {
      onNavigate: navigateToModule,
      metrics: businessMetrics
    };

    switch (currentModule) {
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'crm-book':
        return <CrmBook {...moduleProps} />;
      case 'sales-book':
        return <SalesBook {...moduleProps} />;
      case 'purchase-book':
        return <PurchaseBook {...moduleProps} />;
      case 'inventory':
        return <Inventory {...moduleProps} />;
      case 'reports':
        return <Reports {...moduleProps} />;
      case 'calendar':
        return <Calendar {...moduleProps} />;
      case 'settings':
        return <Settings {...moduleProps} />;
      case 'daily-travel':
        return <DailyTravel {...moduleProps} />;
      case 'visits-book':
        return <VisitsBook {...moduleProps} />;
      default:
        return <EnhancedDashboard />;
    }
  };

  // Initial page load animations
  useEffect(() => {
    const pageAnimation = animatePageIn();
    const scrollAnimation = setupScrollAnimations();

    return () => {
      pageAnimation.revert();
      scrollAnimation.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

  // Module change animations
  useEffect(() => {
    if (prevModule !== currentModule) {
      const moduleAnimation = animateModuleChange(currentModule, prevModule);
      setPrevModule(currentModule);

      // Refresh ScrollTrigger after module change
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => moduleAnimation.revert();
    }
  }, [currentModule, prevModule]);

  // Mobile menu animations
  useEffect(() => {
    if (isMobile) {
      const menuAnimation = animateMobileMenu(mobileMenuOpen);
      return () => menuAnimation.revert();
    }
  }, [mobileMenuOpen, isMobile]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`app-container ${isMobile ? 'mobile-layout' : 'desktop-layout'}`} ref={appRef}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="sidebar-navigation" ref={sidebarRef}>
          <div className="sidebar-header">
            <div className="company-brand">
              <h1 className="company-name">Harsh Lifesciences</h1>
              <p className="system-tagline">ERP & CRM System</p>
            </div>
            <div className="system-version">v2.0</div>
          </div>
          
          <nav className="navigation-sections">
            {Object.values(navigationStructure).map(section => (
              <div key={section.id} className="section-wrapper">
                <div className="section-header">
                  <span className="section-icon">{section.icon}</span>
                  <h3 className="section-title">{section.title}</h3>
                </div>
                <div className="nav-items-list">
                  {section.modules.map(item => (
                    <button
                      key={item.id}
                      data-module={item.id}
                      className={`nav-item ${currentModule === item.id ? 'active' : ''}`}
                      onClick={() => navigateToModule(item.id)}
                      style={{ '--kpi-color': item.color }}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-text">{item.title}</span>
                      {item.id === 'crm-book' && (
                        <span className="nav-badge">{notifications}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="main-content-area" ref={mainContentRef}>
        {/* Header Navigation */}
        <header className="header-navigation" ref={headerRef}>
          <div className="header-left">
            {isMobile && (
              <button 
                className="menu-toggle-btn"
                onClick={handleMobileMenuToggle}
              >
                <span>☰</span>
              </button>
            )}
            <div className="breadcrumb-trail" ref={breadcrumbRef}>
              <span className="module-category">
                {navigationStructure[activeSection]?.icon}
                {activeSection.toUpperCase()}
              </span>
              <span className="breadcrumb-separator">/</span>
              <span className="current-module">
                <span className="module-icon">
                  {navigationStructure[activeSection]?.modules?.find(m => m.id === currentModule)?.icon}
                </span>
                <span>
                  {navigationStructure[activeSection]?.modules?.find(m => m.id === currentModule)?.title || 
                   currentModule.replace('-', ' ')}
                </span>
              </span>
            </div>
          </div>
          
          <div className="header-actions" ref={headerActionsRef}>
            <button className="action-button notification-btn">
              <span>🔔</span>
              <span className="notification-badge">{notifications}</span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">RK</div>
              <div className="user-info">
                <span className="user-name">Rajesh Kumar</span>
                <span className="user-role">Sales Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobile && mobileMenuOpen && (
          <div 
            className="mobile-navigation-overlay" 
            ref={mobileOverlayRef}
            onClick={() => setMobileMenuOpen(false)}
          >
            <aside 
              className="mobile-sidebar" 
              ref={mobileSidebarRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-sidebar-header">
                <div className="company-brand">
                  <h1 className="company-name">Harsh Lifesciences</h1>
                  <p className="system-tagline">ERP & CRM System</p>
                </div>
                <button 
                  className="mobile-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ✕
                </button>
              </div>
              
              <nav className="mobile-sidebar-nav">
                {Object.values(navigationStructure).map(section => (
                  <div key={section.id} className="nav-section">
                    <h3 className="section-title">{section.title}</h3>
                    {section.modules.map(item => (
                      <button
                        key={item.id}
                        data-module={item.id}
                        className={`nav-item ${currentModule === item.id ? 'active' : ''}`}
                        onClick={() => navigateToModule(item.id)}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.title}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Content Container */}
        <main className="content-container">
          <div className="app-main">
            {renderCurrentModule()}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <nav className="mobile-bottom-navigation" ref={mobileBottomNavRef}>
            {['dashboard', 'crm-book', 'sales-book', 'calendar'].map(moduleId => {
              const module = Object.values(navigationStructure)
                .flatMap(s => s.modules)
                .find(m => m.id === moduleId);
              
              if (!module) return null;
              
              return (
                <button
                  key={moduleId}
                  data-module={moduleId}
                  className={`nav-action-button ${currentModule === moduleId ? 'active' : ''}`}
                  onClick={() => navigateToModule(moduleId)}
                >
                  <span className="nav-btn-icon">{module.icon}</span>
                  <span className="nav-btn-label">{module.title.split(' ')[0]}</span>
                </button>
              );
            })}
            <button
              className="nav-action-button more-action-button"
              onClick={handleMobileMenuToggle}
            >
              <span className="nav-btn-icon">☰</span>
              <span className="nav-btn-label">More</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default App;