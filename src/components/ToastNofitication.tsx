import { useState, useEffect } from 'react';
import '../styles/css/ToastNotification.css';

export interface ToastProps {
  id: number;
  title: string;
  description: string;
  color: string;
  png: string;
}

const Notification = ({ title, description, color, png }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`notification-container ${visible ? 'visible' : ''}`}>
      <div className="notification">
        <div className={`notification-header ${color}`}>
          <span className="emoji">{png}</span>
          <h4 className="title">{title}</h4>
        </div>
        <div className="description">{description}</div>
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default Notification;
