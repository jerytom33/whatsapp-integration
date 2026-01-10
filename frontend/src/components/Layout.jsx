import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    const location = useLocation();
    const isWorkflowPage = location.pathname === '/workflows';

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Sidebar collapsed={isWorkflowPage} />
            <main style={{
                flex: 1,
                overflowY: 'auto',
                padding: '2rem',
                backgroundColor: 'var(--color-bg-base)',
                maxWidth: isWorkflowPage ? '100%' : '1200px',
                margin: isWorkflowPage ? '0' : '0 auto'
            }}>
                <div style={{
                    maxWidth: isWorkflowPage ? '100%' : '1200px',
                    margin: '0 auto',
                    height: isWorkflowPage ? '100%' : 'auto'
                }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
