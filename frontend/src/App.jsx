import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Settings from './pages/Settings';
import ShopifySettings from './pages/ShopifySettings';
import Template from './pages/Templates';
import Messaging from './pages/Messaging';
import WebhookLogs from './pages/WebhookLogs';
import Inbox from './pages/Inbox';
import Workflows from './pages/Workflows';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/settings" replace />} />
          <Route path="settings" element={<Settings />} />
          <Route path="shopify" element={<ShopifySettings />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="templates" element={<Template />} />
          <Route path="messaging" element={<Messaging />} />
          <Route path="webhooks" element={<WebhookLogs />} />
          <Route path="workflows" element={<Workflows />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
