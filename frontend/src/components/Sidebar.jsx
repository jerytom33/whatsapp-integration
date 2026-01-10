import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Settings, FileText, Activity, ShoppingBag } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-title">
                    <MessageSquare size={24} />
                    <span>WA Bridge</span>
                </div>
            </div>
            <nav>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/inbox" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease'
                            })}
                        >
                            <MessageSquare size={20} />
                            <span>Inbox</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/messaging" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease'
                            })}
                        >
                            <LayoutDashboard size={20} />
                            <span>Messaging</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/templates" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease'
                            })}
                        >
                            <FileText size={20} />
                            <span>Templates</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/webhooks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease'
                            })}
                        >
                            <Activity size={20} />
                            <span>Logs</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/shopify" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease'
                            })}
                        >
                            <ShoppingBag size={20} />
                            <span>Shopify</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                background: isActive ? 'var(--color-bg-hover)' : 'transparent',
                                fontWeight: isActive ? '700' : '500',
                                marginBottom: '0.25rem',
                                transition: 'all 0.2s ease'
                            })}
                        >
                            <Settings size={20} />
                            <span>Settings</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
