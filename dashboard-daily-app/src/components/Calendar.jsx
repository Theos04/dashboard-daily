import React, { useState, useRef, useEffect } from 'react';
import "../styles/calendar.css";

const Calendar = ({ onNavigate }) => {
  const [currentView, setCurrentView] = useState('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Meeting', date: new Date(2024, 0, 15, 10, 0), duration: 60, color: '#3b82f6' },
    { id: 2, title: 'Project Deadline', date: new Date(2024, 0, 20, 17, 0), duration: 120, color: '#ef4444' },
    { id: 3, title: 'Client Call', date: new Date(2024, 0, 10, 14, 30), duration: 30, color: '#10b981' },
    { id: 4, title: 'Quarterly Review', date: new Date(2024, 0, 25, 9, 0), duration: 180, color: '#8b5cf6' },
    { id: 5, title: 'Weekly Sync', date: new Date(), duration: 60, color: '#f59e0b' }
  ]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 60,
    color: '#3b82f6'
  });
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Event handlers
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case 'daily':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'quarterly':
        newDate.setMonth(newDate.getMonth() - 3);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'quarterly':
        newDate.setMonth(newDate.getMonth() + 3);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleAddEvent = () => {
    const [hours, minutes] = newEvent.time.split(':');
    const eventDate = new Date(newEvent.date);
    eventDate.setHours(parseInt(hours), parseInt(minutes));
    
    const newEventObj = {
      id: events.length + 1,
      title: newEvent.title,
      date: eventDate,
      duration: parseInt(newEvent.duration),
      color: newEvent.color
    };
    
    setEvents([...events, newEventObj]);
    setIsAddingEvent(false);
    setNewEvent({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: 60,
      color: '#3b82f6'
    });
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
    setSelectedEvent(null);
  };

  // Helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getWeekDates = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + i);
      week.push(dayDate);
    }
    return week;
  };

  const getQuarterDates = (date) => {
    const quarter = Math.floor(date.getMonth() / 3);
    const startMonth = quarter * 3;
    const months = [];
    
    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(date.getFullYear(), startMonth + i, 1);
      months.push(monthDate);
    }
    
    return months;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Render views
  const renderDailyView = () => {
    const dayEvents = events.filter(event => 
      event.date.toDateString() === currentDate.toDateString()
    ).sort((a, b) => a.date - b.date);
    
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="daily-view">
        <div className="daily-header">
          <h3>{formatDate(currentDate)}</h3>
          <div className="day-stats">
            <span className="stat-badge">{dayEvents.length} events</span>
            <span className="stat-badge">
              {dayEvents.reduce((total, event) => total + event.duration, 0)} minutes
            </span>
          </div>
        </div>
        <div className="time-grid">
          {hours.map(hour => (
            <div key={hour} className="time-slot">
              <div className="hour-label">
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
              <div className="hour-content">
                {dayEvents
                  .filter(event => event.date.getHours() === hour)
                  .map(event => (
                    <div
                      key={event.id}
                      className="event-block"
                      style={{ backgroundColor: event.color }}
                      onClick={() => handleEventClick(event)}
                    >
                      <span className="event-title">{event.title}</span>
                      <span className="event-time">{formatTime(event.date)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekDates = getWeekDates(currentDate);
    
    return (
      <div className="weekly-view">
        <div className="week-header">
          {weekDates.map((date, index) => (
            <div key={index} className="week-day-header">
              <div className="week-day-name">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`week-day-date ${date.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="week-grid">
          {weekDates.map((date, dayIndex) => {
            const dayEvents = events.filter(event => 
              event.date.toDateString() === date.toDateString()
            );
            
            return (
              <div key={dayIndex} className="week-day">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="event-item"
                    style={{ borderLeftColor: event.color }}
                    onClick={() => handleEventClick(event)}
                  >
                    <span className="event-time-small">{formatTime(event.date)}</span>
                    <span className="event-title-small">{event.title}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks
    const nextMonthStart = days.length;
    for (let i = 1; i <= totalCells - nextMonthStart; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
        isCurrentMonth: false
      });
    }
    
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return (
      <div className="monthly-view">
        <div className="weekdays-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((day, dayIndex) => {
              const dayEvents = events.filter(event => 
                event.date.toDateString() === day.date.toDateString()
              );
              const isToday = day.date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={dayIndex}
                  className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                >
                  <div className="day-header">
                    <span className="day-number">{day.date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <span className="event-count">{dayEvents.length}</span>
                    )}
                  </div>
                  <div className="day-events">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className="event-dot"
                        style={{ backgroundColor: event.color }}
                        onClick={() => handleEventClick(event)}
                        title={event.title}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderQuarterlyView = () => {
    const quarterMonths = getQuarterDates(currentDate);
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const currentQuarter = quarters[Math.floor(currentDate.getMonth() / 3)];
    
    return (
      <div className="quarterly-view">
        <div className="quarter-header">
          <h3>{currentDate.getFullYear()} {currentQuarter}</h3>
        </div>
        <div className="quarter-grid">
          {quarterMonths.map((monthDate, index) => {
            const monthEvents = events.filter(event => 
              event.date.getMonth() === monthDate.getMonth() &&
              event.date.getFullYear() === monthDate.getFullYear()
            );
            
            return (
              <div key={index} className="quarter-month">
                <div className="month-header">
                  <h4>{monthDate.toLocaleDateString('en-US', { month: 'long' })}</h4>
                  <span className="month-event-count">{monthEvents.length} events</span>
                </div>
                <div className="month-events">
                  {monthEvents.slice(0, 5).map(event => (
                    <div
                      key={event.id}
                      className="quarter-event"
                      style={{ borderLeftColor: event.color }}
                      onClick={() => handleEventClick(event)}
                    >
                      <span className="event-date">{event.date.getDate()}</span>
                      <span className="event-title-small">{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render stats
  const renderStats = () => {
    const today = new Date();
    const todayEvents = events.filter(event => 
      event.date.toDateString() === today.toDateString()
    );
    const thisWeekEvents = events.filter(event => {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return event.date >= weekStart && event.date <= weekEnd;
    });
    
    return (
      <div className="calendar-stats">
        <div className="stat-card">
          <div className="stat-value">{todayEvents.length}</div>
          <div className="stat-label">Today's Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{thisWeekEvents.length}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{events.length}</div>
          <div className="stat-label">Total Events</div>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>
          ← Back to Dashboard
        </button>
        <h2>Calendar Management</h2>
      </div>

      <div className="calendar-controls">
        <div className="view-controls">
          <button 
            className={`view-btn ${currentView === 'daily' ? 'active' : ''}`}
            onClick={() => setCurrentView('daily')}
          >
            Daily
          </button>
          <button 
            className={`view-btn ${currentView === 'weekly' ? 'active' : ''}`}
            onClick={() => setCurrentView('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`view-btn ${currentView === 'monthly' ? 'active' : ''}`}
            onClick={() => setCurrentView('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`view-btn ${currentView === 'quarterly' ? 'active' : ''}`}
            onClick={() => setCurrentView('quarterly')}
          >
            Quarterly
          </button>
        </div>

        <div className="date-controls">
          <button className="nav-btn" onClick={handlePrev}>←</button>
          <button className="today-btn" onClick={handleToday}>Today</button>
          <button className="nav-btn" onClick={handleNext}>→</button>
        </div>

        <div className="action-controls">
          <button 
            className="add-event-btn"
            onClick={() => setIsAddingEvent(true)}
          >
            + Add Event
          </button>
        </div>
      </div>

      {renderStats()}

      <div className="calendar-view">
        {currentView === 'daily' && renderDailyView()}
        {currentView === 'weekly' && renderWeeklyView()}
        {currentView === 'monthly' && renderMonthlyView()}
        {currentView === 'quarterly' && renderQuarterlyView()}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedEvent.title}</h3>
              <button className="close-btn" onClick={() => setSelectedEvent(null)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
              <p><strong>Time:</strong> {formatTime(selectedEvent.date)}</p>
              <p><strong>Duration:</strong> {selectedEvent.duration} minutes</p>
              <div className="modal-actions">
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  Delete Event
                </button>
                <button 
                  className="close-modal-btn"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddingEvent && (
        <div className="modal-overlay" onClick={() => setIsAddingEvent(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Event</h3>
              <button className="close-btn" onClick={() => setIsAddingEvent(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Event Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (min)</label>
                  <input
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: e.target.value})}
                    min="15"
                    step="15"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="color-options">
                  {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                    <button
                      key={color}
                      className={`color-option ${newEvent.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewEvent({...newEvent, color})}
                    />
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button className="save-btn" onClick={handleAddEvent}>
                  Save Event
                </button>
                <button className="cancel-btn" onClick={() => setIsAddingEvent(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="calendar-footer">
        <div className="legend">
          <span className="legend-title">Legend:</span>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#3b82f6' }} />
              <span>Meetings</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ef4444' }} />
              <span>Deadlines</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981' }} />
              <span>Calls</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;