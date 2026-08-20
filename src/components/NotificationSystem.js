import React, { useState, useEffect } from 'react';

const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = NOTIFICATION_TYPES.INFO, duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, timestamp: Date.now() };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Expose methods globally for easy access
  useEffect(() => {
    window.notificationSystem = {
      success: (message, duration) => addNotification(message, NOTIFICATION_TYPES.SUCCESS, duration),
      error: (message, duration) => addNotification(message, NOTIFICATION_TYPES.ERROR, duration),
      warning: (message, duration) => addNotification(message, NOTIFICATION_TYPES.WARNING, duration),
      info: (message, duration) => addNotification(message, NOTIFICATION_TYPES.INFO, duration)
    };
    
    return () => {
      delete window.notificationSystem;
    };
  }, []);

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification--${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification__content">
            <span className="notification__icon">
              {notification.type === NOTIFICATION_TYPES.SUCCESS && '✅'}
              {notification.type === NOTIFICATION_TYPES.ERROR && '❌'}
              {notification.type === NOTIFICATION_TYPES.WARNING && '⚠️'}
              {notification.type === NOTIFICATION_TYPES.INFO && 'ℹ️'}
            </span>
            <span className="notification__message">{notification.message}</span>
          </div>
          <button 
            className="notification__close"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
