import React, { useState, useEffect } from 'react';
import { Save, ShoppingBag } from 'lucide-react';
import '../pages/pages.css';

const ShopifySettings = () => {
    // Shopify State
    const [shopDomain, setShopDomain] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [webhookSecret, setWebhookSecret] = useState('');

    const [status, setStatus] = useState('');

    useEffect(() => {
        // Load Shopify settings from Backend
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend';
        fetch(`${baseUrl}/api/settings/shopify`)
            .then(res => res.json())
            .then(data => {
                if (data.shopDomain) setShopDomain(data.shopDomain);
                if (data.accessToken) setAccessToken(data.accessToken);
                if (data.webhookSecret) setWebhookSecret(data.webhookSecret);
            })
            .catch(err => console.error('Error fetching settings:', err));
    }, []);

    const handleSave = async () => {
        // Save Shopify settings to Backend
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend';
            const res = await fetch(`${baseUrl}/api/settings/shopify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shopDomain,
                    accessToken: accessToken.includes('***') ? undefined : accessToken, // Don't resend mask
                    webhookSecret: webhookSecret.includes('***') ? undefined : webhookSecret
                })
            });

            if (res.ok) {
                setStatus('Shopify settings saved successfully!');
            } else {
                setStatus('Failed to save settings to server.');
            }
        } catch (error) {
            console.error('Save error:', error);
            setStatus('Error saving settings.');
        }

        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Shopify Integration</h1>
                <p className="page-subtitle">Manage your Shopify store connection</p>
            </div>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <ShoppingBag size={24} color="var(--color-primary)" />
                    <h3>Store Configuration</h3>
                </div>

                <div className="form-group">
                    <label className="form-label">Shop Domain</label>
                    <input
                        type="text"
                        className="form-input"
                        value={shopDomain}
                        onChange={(e) => setShopDomain(e.target.value)}
                        placeholder="your-shop.myshopify.com"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Admin Access Token</label>
                    <input
                        type="password"
                        className="form-input"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder="shpat_..."
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Webhook Secret</label>
                    <input
                        type="password"
                        className="form-input"
                        value={webhookSecret}
                        onChange={(e) => setWebhookSecret(e.target.value)}
                        placeholder="shpss_..."
                    />
                </div>

                <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '20px' }}>
                    <Save size={18} />
                    Save Configuration
                </button>

                {status && <div className="status-check">{status}</div>}
            </div>

            {/* Product Fetching Section */}
            <div className="card" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <ShoppingBag size={24} color="var(--color-primary)" />
                    <h3>Test Connection & Fetch Products</h3>
                </div>
                <p>Click below to verify your connection by fetching products from your Shopify store.</p>

                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        setStatus('Fetching products...');
                        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend';
                        fetch(`${baseUrl}/api/shopify/products`)
                            .then(res => {
                                if (!res.ok) throw new Error('Failed to fetch products');
                                return res.json();
                            })
                            .then(data => {
                                setStatus(`Successfully fetched ${data.length} products!`);
                                console.log('Products:', data);
                                // Optionally display products
                                alert(`Fetched ${data.length} products. Check console for details.`);
                            })
                            .catch(err => {
                                console.error(err);
                                setStatus('Error fetching products: ' + err.message);
                            });
                    }}
                    style={{ marginTop: '10px' }}
                >
                    Fetch Products
                </button>
            </div>
        </div>
    );
};

export default ShopifySettings;
