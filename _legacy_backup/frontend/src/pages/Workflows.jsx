import React from 'react';
import { Workflow } from 'lucide-react';

const Workflows = () => {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className="icon-wrapper">
                        <Workflow size={24} color="#008069" />
                    </div>
                    <div>
                        <h1>Workflow Builder</h1>
                        <p className="subtitle">Visually build and automate your WhatsApp workflows</p>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <iframe
                    src="http://localhost:3003/dashboard"
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Workflow Builder"
                />
            </div>
        </div>
    );
};

export default Workflows;
