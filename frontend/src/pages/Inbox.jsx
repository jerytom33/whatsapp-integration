import React, { useState, useEffect } from 'react';
import { Send, User, Search } from 'lucide-react';
import api from '../services/api';
import './pages.css';

const Inbox = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch conversations on load
    useEffect(() => {
        fetchChats();
        // Polling for new chats every 10s
        const interval = setInterval(fetchChats, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchChats = async () => {
        try {
            const res = await api.get('/chats');
            setConversations(res.data);
        } catch (err) {
            console.error('Failed to load chats', err);
        }
    };

    // Fetch messages when chat selected
    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.phone_number);
            // Polling for new messages in active chat
            const interval = setInterval(() => fetchMessages(selectedChat.phone_number), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedChat]);

    const fetchMessages = async (phone) => {
        try {
            const res = await api.get(`/chats/${phone}/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to load messages', err);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
            // Optimistic Update
            const tempMsg = {
                direction: 'OUTBOUND',
                type: 'text',
                content: { body: newMessage },
                created_at: new Date().toISOString()
            };
            setMessages([...messages, tempMsg]);
            setNewMessage('');

            await api.post('/send', {
                messaging_product: 'whatsapp',
                to: selectedChat.phone_number,
                type: 'text',
                text: { body: newMessage }
            });

            // Refresh to get actual DB state
            fetchMessages(selectedChat.phone_number);
        } catch (err) {
            alert('Failed to send');
        }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '1rem' }}>
            {/* Sidebar List */}
            <div className="card" style={{ width: '300px', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: 'none', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div className="search-box" style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg-base)', padding: '0.6rem 1rem', borderRadius: '50px', border: '1px solid transparent', transition: 'all 0.2s' }}>
                        <Search size={18} color="var(--color-text-muted)" />
                        <input placeholder="Search chats..." style={{ border: 'none', background: 'transparent', marginLeft: '0.5rem', width: '100%', outline: 'none', color: 'var(--color-text)', padding: 0 }} />
                    </div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            style={{
                                padding: '1rem 1.25rem',
                                cursor: 'pointer',
                                background: selectedChat?.id === chat.id ? 'var(--color-bg-hover)' : 'transparent',
                                borderLeft: selectedChat?.id === chat.id ? '4px solid var(--color-primary)' : '4px solid transparent',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => { if (selectedChat?.id !== chat.id) e.currentTarget.style.background = '#F8FAFC'; }}
                            onMouseLeave={(e) => { if (selectedChat?.id !== chat.id) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#64748B', fontWeight: 'bold' }}>
                                    {/* Initials could go here */}<User size={22} />
                                </div>
                                <div style={{ overflow: 'hidden', flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text)' }}>{chat.contact_name || 'Unknown User'}</h4>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '500', marginBottom: '2px' }}>{chat.phone_number}</div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {chat.last_message_preview || 'No messages'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', border: 'none', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                {selectedChat ? (
                    <>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', background: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="#64748B" />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{selectedChat.contact_name || 'Unknown User'}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '500' }}>{selectedChat.phone_number}</div>
                            </div>
                        </div>

                        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F4F7F6' }}>
                            {messages.map((msg, idx) => {
                                const isOutbound = msg.direction === 'OUTBOUND';
                                return (
                                    <div key={idx} style={{
                                        alignSelf: isOutbound ? 'flex-end' : 'flex-start',
                                        maxWidth: '65%',
                                        background: isOutbound ? 'var(--color-primary)' : '#FFFFFF',
                                        color: isOutbound ? '#FFFFFF' : 'var(--color-text)',
                                        padding: '0.8rem 1rem',
                                        borderRadius: isOutbound ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5'
                                    }}>
                                        <div>
                                            {typeof msg.content === 'string' ? msg.content : (msg.content?.body || JSON.stringify(msg.content))}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: isOutbound ? 'rgba(255,255,255,0.8)' : '#94A3B8', marginTop: '0.4rem', textAlign: 'right' }}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem', background: '#fff' }}>
                            <input
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: '#F8FAFC' }}
                            />
                            <button className="btn btn-primary" onClick={handleSend} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px' }}>
                                <Send size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ width: '80px', height: '80px', background: 'var(--color-bg-base)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={40} color="var(--color-primary)" />
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-text)' }}>Welcome to Whatchimp Inbox</div>
                        <div style={{ fontSize: '0.9rem' }}>Select a conversation to start chatting</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
