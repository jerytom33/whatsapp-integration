import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import './pages.css';

const Settings = () => {
    const [apiKey, setApiKey] = useState('');
    const [wabaId, setWabaId] = useState('');
    const [status, setStatus] = useState('');

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
        setStatus('Settings saved successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Configure your AOC Portal connection</p>
            </div>

            <div className="card">
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
                    <label className="form-label">WABA ID (WhatsApp Business Account ID)</label>
                    <input
                        type="text"
                        className="form-input"
                        value={wabaId}
                        onChange={(e) => setWabaId(e.target.value)}
                        placeholder="e.g. 1903328150241707"
                    />
                </div>

                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={18} />
                    Save Settings
                </button>

                {status && <div className="status-check">{status}</div>}
            </div>
        </div>
    );
};

export default Settings;
