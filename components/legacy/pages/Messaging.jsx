import React, { useState } from 'react';
import { Send } from 'lucide-react';
import api from '@/lib/services/api';
import './pages.css';

const Messaging = () => {
    const [mode, setMode] = useState('template'); // text, template, interactive
    const [to, setTo] = useState('');

    // Template State
    const [templateName, setTemplateName] = useState('hello_world');

    // Text State
    const [textBody, setTextBody] = useState('');

    // Interactive State (List Message Simple)
    const [listHeader, setListHeader] = useState('');
    const [listBody, setListBody] = useState('');
    const [listButton, setListButton] = useState('Options');
    const [listRows, setListRows] = useState([{ id: 'row_1', title: 'Option 1' }]);

    const [status, setStatus] = useState('');
    const [sending, setSending] = useState(false);

    const handleAddRow = () => {
        setListRows([...listRows, { id: `row_${listRows.length + 1}`, title: `Option ${listRows.length + 1}` }]);
    };

    const updateRow = (idx, field, val) => {
        const newRows = [...listRows];
        newRows[idx][field] = val;
        setListRows(newRows);
    };

    const handleSend = async () => {
        if (!to) return;
        setSending(true);
        setStatus('Sending...');

        let payload = {
            messaging_product: "whatsapp",
            to: to,
        };

        try {
            if (mode === 'text') {
                payload.type = 'text';
                payload.text = { body: textBody };
            } else if (mode === 'template') {
                payload.type = 'template';
                payload.template = {
                    name: templateName,
                    language: { code: "en_US" }
                };
            } else if (mode === 'interactive') {
                payload.type = 'interactive';
                payload.interactive = {
                    type: "list",
                    header: { type: "text", text: listHeader },
                    body: { text: listBody },
                    footer: { text: "Select an option" },
                    action: {
                        button: listButton,
                        sections: [
                            {
                                title: "Menu",
                                rows: listRows
                            }
                        ]
                    }
                };
            }

            await api.post('/send', payload);
            setStatus('Message sent successfully!');
        } catch (err) {
            console.error(err);
            setStatus('Failed to send message. ' + (err.response?.data?.error || err.message));
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Messaging</h1>
                <p className="page-subtitle">Send WhatsApp messages</p>
            </div>

            <div className="card" style={{ maxWidth: '600px' }}>
                <div className="form-group">
                    <label className="form-label">Phone Number (with Country Code)</label>
                    <input
                        type="text"
                        className="form-input"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="e.g. 919999999999"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Message Type</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['template', 'text', 'interactive'].map(m => (
                            <button
                                key={m}
                                className={`btn ${mode === m ? 'btn-primary' : ''}`}
                                style={mode !== m ? { background: 'var(--color-bg-base)', border: '1px solid var(--color-border)' } : {}}
                                onClick={() => setMode(m)}
                            >
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {mode === 'template' && (
                    <div className="form-group">
                        <label className="form-label">Template Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="e.g. hello_world"
                        />
                    </div>
                )}

                {mode === 'text' && (
                    <div className="form-group">
                        <label className="form-label">Message Body</label>
                        <textarea
                            className="form-input"
                            value={textBody}
                            onChange={(e) => setTextBody(e.target.value)}
                            placeholder="Type your message here..."
                            rows={4}
                        />
                    </div>
                )}

                {mode === 'interactive' && (
                    <div style={{ padding: '1rem', background: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Header</label>
                            <input className="form-input" value={listHeader} onChange={e => setListHeader(e.target.value)} placeholder="List Header" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Body</label>
                            <input className="form-input" value={listBody} onChange={e => setListBody(e.target.value)} placeholder="List Body text" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Button Text</label>
                            <input className="form-input" value={listButton} onChange={e => setListButton(e.target.value)} placeholder="e.g. Show Options" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Rows</label>
                            {listRows.map((row, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input className="form-input" value={row.id} onChange={e => updateRow(idx, 'id', e.target.value)} placeholder="ID" />
                                    <input className="form-input" value={row.title} onChange={e => updateRow(idx, 'title', e.target.value)} placeholder="Title" />
                                </div>
                            ))}
                            <button className="btn" style={{ fontSize: '0.875rem' }} onClick={handleAddRow}>+ Add Row</button>
                        </div>
                    </div>
                )}

                <button className="btn btn-primary" onClick={handleSend} disabled={sending}>
                    <Send size={18} />
                    {sending ? 'Sending...' : 'Send Message'}
                </button>

                {status && <div className={`status-check ${status.includes('Failed') ? 'error' : ''}`} style={status.includes('Failed') ? { color: 'var(--color-error)', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' } : {}}>{status}</div>}
            </div>
        </div>
    );
};

export default Messaging;
