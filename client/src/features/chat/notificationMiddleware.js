// notificationMiddleware.js
import { addMessage, resetNotifications } from './chatSlice';

const notificationMiddleware = (store) => (next) => (action) => {
  if (action.type === addMessage.type) {
    // Mettre à jour l'état global des notifications
    store.dispatch({ type: 'INCREMENT_NOTIFICATIONS' });
     store.dispatch(resetNotifications());
  }
  return next(action);
};

export default notificationMiddleware;
