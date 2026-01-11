import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Settings, FileText, Activity, ShoppingBag } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ collapsed }) => {
    return (
        <aside className="sidebar" style={{
            width: collapsed ? '60px' : '260px',
            padding: collapsed ? '1rem 0.5rem' : 'var(--space-lg)',
            transition: 'all 0.3s ease'
        }}>
            <div className="sidebar-header" style={{
                marginBottom: collapsed ? '1rem' : 'var(--space-xl)',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div className="sidebar-title" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
                    <MessageSquare size={24} />
                    {!collapsed && <span>WA Bridge</span>}
                </div>
            </div>
            <nav>
                <ul className="nav-list" style={{ alignItems: collapsed ? 'center' : 'stretch' }}>
                    <li>
                        <NavLink to="/inbox" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: collapsed ? '0.75rem' : '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start'
                            })}
                        >
                            <MessageSquare size={20} />
                            {!collapsed && <span>Inbox</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/messaging" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: collapsed ? '0.75rem' : '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start'
                            })}
                        >
                            <LayoutDashboard size={20} />
                            {!collapsed && <span>Messaging</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/templates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: collapsed ? '0.75rem' : '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start'
                            })}
                        >
                            <FileText size={20} />
                            {!collapsed && <span>Templates</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/webhooks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: collapsed ? '0.75rem' : '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start'
                            })}
                        >
                            <Activity size={20} />
                            {!collapsed && <span>Logs</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/shopify" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: collapsed ? '0.75rem' : '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start'
                            })}
                        >
                            <ShoppingBag size={20} />
                            {!collapsed && <span>Shopify</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/workflows" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: collapsed ? '0.75rem' : '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start'
                            })}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="8" height="8" x="3" y="3" rx="2" />
                                    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
                                    <rect width="8" height="8" x="13" y="13" rx="2" />
                                </svg>
                            </span>
                            {!collapsed && <span>Workflows</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: collapsed ? '0.75rem' : '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start'
                            })}
                        >
                            <Settings size={20} />
                            {!collapsed && <span>Settings</span>}
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside >
    );
};

export default Sidebar;
