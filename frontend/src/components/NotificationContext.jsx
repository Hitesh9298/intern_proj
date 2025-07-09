import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  // console.log('NotificationProvider user:', user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications when user changes
  useEffect(() => {
    if (user?._id) {
      // console.log('Fetching notifications for user:', user);
      setLoading(true);
      axios.get(`http://localhost:5000/api/notifications/${user._id}`)
        .then(res => {
          // console.log('Fetched notifications:', res.data);
          setNotifications(res.data)
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Mark as read
  const markAsRead = async (id) => {
    await axios.post(`http://localhost:5000/api/notifications/read/${id}`);
    setNotifications(notifications =>
      notifications.map(n => n._id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
      markAsRead,
      loading
    }}>
      {children}
    </NotificationContext.Provider>
  );
}