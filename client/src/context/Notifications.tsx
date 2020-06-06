import React from 'react';
import { uuid } from 'uuidv4';

import { INotification, INotificationAction } from '../models';
import { Alert } from '../components';

export interface INotificationsContext {
    notifications: INotification[];
    pushNotification: (notification: INotification) => void;
}

export const NotificationsContext = React.createContext<INotificationsContext>({
    notifications: null as any,
    pushNotification: null as any
});

export const NotificationsProvider: React.FC = ({ children }) => {
    const [notifications, setNotifications] = React.useState<INotification[]>([]);

    const pushNotification = (notification: INotification) => (
        setNotifications(state => [...state, { ...notification, id: uuid() }])
    );

    const handleNotification = (id: string, callback?: INotificationAction['onClick']) => {
        callback && callback();
        setNotifications(state => state.filter(notification => notification.id !== id));
    }

    return (
        <NotificationsContext.Provider value={{
            notifications,
            pushNotification
        }}>
            {children}
            {notifications.map(notification => (
                <Alert
                    key={notification.id}
                    onClose={() => handleNotification(notification.id as any, notification.decline?.onClick)}
                    title={notification.title}
                    message={notification.message}
                    view={notification.view}
                    actions={notification.accept && notification.decline ? [
                        {
                            label: notification.decline?.label,
                            onClick: () => handleNotification(notification.id as any, notification.decline?.onClick)
                        },
                        {
                            label: notification.accept.label,
                            onClick: () => handleNotification(notification.id as any, notification.accept?.onClick)
                        },
                    ] : undefined}
                />
            ))}
        </NotificationsContext.Provider>
    );
};

NotificationsProvider.displayName = 'NotificationsProvider';
