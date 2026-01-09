import React, { useState, useEffect } from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import axios from 'axios';
import './pages.css';

// Using direct axios here or standard api client if interceptors not needed for this public-ish endpoint
// Logs endpoint is on the backend, typically protected? 
// For now, assuming it's accessible or using the same client but it's on webhooks route which is separate?
// Actually logs are under /webhooks/logs, so we can use direct axios to localhost:3002 for simplicity or configure API client.
// Let's use direct URL for the logs since it's "webhooks" router not "api" router.
const LOGS_URL = 'http://localhost:3002/webhooks/logs';

const WebhookLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(LOGS_URL);
            setLogs(response.data);
        } catch (error) {
            console.error('Failed to fetch logs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Webhook Logs</h1>
                <p className="page-subtitle">Real-time view of incoming webhook events</p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <button className="btn btn-primary" onClick={fetchLogs} disabled={loading} style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    Refresh Now
                </button>
            </div>

            <div className="card">
                {logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                        <Activity size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No webhooks received yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {logs.map((log, idx) => (
                            <div key={idx} style={{
                                padding: '1rem',
                                background: 'var(--color-bg-base)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                borderLeft: '4px solid var(--color-primary)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--color-primary-light)' }}>
                                        {log.payload?.entry?.[0]?.changes?.[0]?.value?.messages ? 'MESSAGE' : 'EVENT'}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                        {new Date(log.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <pre style={{
                                    margin: 0,
                                    fontSize: '0.85rem',
                                    color: 'var(--color-text-muted)',
                                    overflowX: 'auto',
                                    fontFamily: 'monospace'
                                }}>
                                    {JSON.stringify(log.payload, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebhookLogs;
