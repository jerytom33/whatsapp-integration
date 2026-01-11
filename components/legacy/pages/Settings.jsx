import React, { useState, useEffect } from 'react';
import { Save, Copy, Check, Link as LinkIcon } from 'lucide-react';
import './pages.css';

const Settings = () => {
    const [apiKey, setApiKey] = useState('');
    const [wabaId, setWabaId] = useState('');
    const [status, setStatus] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('aoc_api_key');
        const savedWabaId = localStorage.getItem('aoc_waba_id');
        if (savedKey) setApiKey(savedKey);
        if (savedWabaId) setWabaId(savedWabaId);
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('aoc_api_key', apiKey.trim());
        }
        if (wabaId.trim()) {
            localStorage.setItem('aoc_waba_id', wabaId.trim());
        }
        
        // Generate webhook URL
        const baseUrl = window.location.origin;
        const generatedUrl = `${baseUrl}/api/backend/webhook/whatsapp`;
        setWebhookUrl(generatedUrl);
        
        setStatus('Settings saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    const handleCopyWebhook = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Configure your AOC Portal connection</p>
            </div>

            <div className="card">
                <h3>AOC Portal Settings</h3>
                <div className="form-group">
                    <label className="form-label">AOC Portal API Key</label>
                    <input
                        type="password"
                        className="form-input"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API Key"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">WABA ID</label>
                    <input
                        type="text"
                        className="form-input"
                        value={wabaId}
                        onChange={(e) => setWabaId(e.target.value)}
                        placeholder="e.g. 1903328150241707"
                    />
                </div>

                <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '20px' }}>
                    <Save size={18} />
                    Save Settings
                </button>

                {status && <div className="status-check">{status}</div>}
            </div>

            {webhookUrl && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LinkIcon size={20} />
                        Webhook URL
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
                        Use this URL to configure your WhatsApp webhook in the AOC Portal
                    </p>
                    <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)'
                    }}>
                        <input
                            type="text"
                            className="form-input"
                            value={webhookUrl}
                            readOnly
                            style={{ 
                                flex: 1,
                                backgroundColor: 'transparent',
                                border: 'none',
                                fontFamily: 'monospace',
                                fontSize: '13px'
                            }}
                        />
                        <button 
                            className="btn btn-secondary" 
                            onClick={handleCopyWebhook}
                            style={{ 
                                minWidth: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            {copied ? (
                                <>
                                    <Check size={16} />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                    <p style={{ 
                        color: 'var(--color-text-secondary)', 
                        fontSize: '12px', 
                        marginTop: '12px',
                        fontStyle: 'italic'
                    }}>
                        💡 Tip: Set the verify token in your environment variables (WEBHOOK_VERIFY_TOKEN)
                    </p>
                </div>
            )}
        </div>
    );
};

export default Settings;
