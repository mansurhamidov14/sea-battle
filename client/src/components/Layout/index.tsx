import React from 'react';

import './styles.scss';

export const Layout: React.FC = ({ children }) => (
    <div className="layout">
        {children}
    </div>
)