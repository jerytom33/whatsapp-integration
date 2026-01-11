import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, X, Save } from 'lucide-react';
import api from '@/lib/services/api';
import './pages.css';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Create Template State
    const [showCreate, setShowCreate] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        category: 'UTILITY',
        language: 'en_US',
        bodyText: 'Hello {{1}}',
    });
    const [createLoading, setCreateLoading] = useState(false);

    const fetchTemplates = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/templates');
            setTemplates(response.data.data || response.data || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch templates. Check your API Key.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleCreate = async () => {
        setCreateLoading(true);
        try {
            const wabaId = localStorage.getItem('aoc_waba_id');
            if (!wabaId) {
                alert('Please go to Settings and save your WABA ID first.');
                setCreateLoading(false);
                return;
            }

            // Mapping structure to what aocService likely expects or direct proxy
            // Note: aocService might need to be checked if it handles this structure
            const payload = {
                wabaId: wabaId,
                name: newTemplate.name,
                category: newTemplate.category,
                language: newTemplate.language,
                components: [
                    {
                        type: "BODY",
                        text: newTemplate.bodyText
                    }
                ]
            };
            // Ensure this endpoint exists in backend or add it
            await api.post('/templates', payload);
            setShowCreate(false);
            fetchTemplates(); // Refresh list
        } catch (err) {
            alert('Failed to create template: ' + (err.response?.data?.error || err.message));
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Templates</h1>
                <p className="page-subtitle">Manage your WhatsApp templates</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    <Plus size={18} />
                    Create Template
                </button>
                <button className="btn" onClick={fetchTemplates} disabled={loading} style={{ background: 'white', border: '1px solid var(--color-border)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    Refresh
                </button>
            </div>

            {error && <div className="status-check" style={{ color: 'var(--color-error)', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' }}>{error}</div>}

            {/* Create Modal (Simple inline overlay for now) */}
            {showCreate && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>New Template</h2>
                            <button onClick={() => setShowCreate(false)} style={{ background: 'transparent' }}><X size={24} color="var(--color-text-muted)" /></button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Template Name</label>
                            <input className="form-input" value={newTemplate.name} onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })} placeholder="my_template_name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-input" value={newTemplate.category} onChange={e => setNewTemplate({ ...newTemplate, category: e.target.value })}>
                                <option value="UTILITY">Utility</option>
                                <option value="MARKETING">Marketing</option>
                                <option value="AUTHENTICATION">Authentication</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Language</label>
                            <input className="form-input" value={newTemplate.language} onChange={e => setNewTemplate({ ...newTemplate, language: e.target.value })} placeholder="en_US" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Body Text (Use {"{{1}}"} for variables)</label>
                            <textarea className="form-input" rows={4} value={newTemplate.bodyText} onChange={e => setNewTemplate({ ...newTemplate, bodyText: e.target.value })} />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button className="btn" style={{ background: 'transparent', border: '1px solid var(--color-border)' }} onClick={() => setShowCreate(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleCreate} disabled={createLoading}>
                                <Save size={18} />
                                {createLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                {loading ? (
                    <p>Loading templates...</p>
                ) : templates.length === 0 ? (
                    <p>No templates found.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {templates.map((tpl, idx) => (
                            <div key={idx} style={{ padding: '1rem', background: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                <strong>{tpl.name || 'Unnamed Template'}</strong>
                                <span style={{ marginLeft: '1rem', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--color-bg-hover)' }}>{tpl.status}</span>
                                <pre style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                    {JSON.stringify(tpl, null, 2)}
                                </pre>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Templates;
