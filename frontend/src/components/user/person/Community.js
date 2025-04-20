import React, { useEffect, useState } from 'react';
import Nav_person from './nav';
import axios from 'axios';

function Community() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');

  // === Fetch user info on load
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated) {
          setUserName(data.user);
        } else {
          window.location.href = './login';
        }
      });
  }, []);
  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/csrf/', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken); // Save the token for future use
      })
      .catch((err) => console.error('CSRF fetch error:', err));
  }, []);
  
  // === Fetch messages
  const fetchMessages = () => {
    axios
      .get('http://localhost:8000/api/accounts/messages/', { withCredentials: true })
      .then(res => setMessages(res.data))
      .catch(err => console.error('Error fetching messages:', err));
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // === Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        'http://localhost:8000/api/accounts/messages/',
        {
          sender: userName,
          content: newMessage,
        },
        { withCredentials: true }
      );

      setNewMessage('');
      fetchMessages(); // Refresh messages
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container-xxl position-relative p-0">
        <Nav_person />
        <div className="container-xxl bg-primary page-header">
          <div className="container text-center">
            <h1 className="text-white animated zoomIn mb-3">Community</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item"><a className="text-white" href="#">Home</a></li>
                <li className="breadcrumb-item"><a className="text-white" href="#">Pages</a></li>
                <li className="breadcrumb-item text-white active" aria-current="page">Community</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Community Chat</h5>
          </div>
          <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div key={index} className="mb-3">
                  <strong>{msg.sender}:</strong> <span>{msg.content}</span>
                  <div className="text-muted small">{new Date(msg.timestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <p className="text-muted">No messages yet.</p>
            )}
          </div>
          <div className="card-footer">
            <form onSubmit={handleSendMessage} className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
