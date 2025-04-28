import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

function ChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const chatBoxRef = useRef(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [chatClosed, setChatClosed] = useState(false);
  const [userType, setUserType] = useState('');
  const messageSound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem('chatMuted') === 'true'
  );

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/csrf/", {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(console.error);
  }, []);


  useEffect(() => {
    fetch('http://localhost:8000/api/accounts/accountstatus/', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.isAuthenticated) {
          setCurrentUserId(data.user_id);
          setUserType(data.userType);
        }
      });
  }, [csrfToken]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/accounts/chat-status/${id}/`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setChatClosed(data.chat_closed));
  }, [id]);

  useEffect(() => {
    let lastMessageCount = messages.length;
  
    const fetchMessages = () => {
      fetch(`http://localhost:8000/api/accounts/chat/${id}/`, {
        credentials: 'include',
      })
        .then(res => {
          if (res.status === 403) {
            alert("🚫 You are not authorized to access this chat.");
            window.location.href = "/"; // or use navigate('/') if using react-router
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (!data) return;
  
          const newMessages = data.messages;
          const newCount = newMessages.length;
  
          if (
            newCount > lastMessageCount &&
            !isMuted &&
            newMessages[newCount - 1].sender !== currentUserId
          ) {
            messageSound.volume = 1;
            messageSound.play().catch(err => console.log("🔇 Audio play blocked:", err));
          }
  
          lastMessageCount = newCount;
          setMessages(newMessages);
          setIsOtherTyping(data.typing);
  
          if (chatBoxRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
            if (isAtBottom) {
              scrollToBottom();
            }
          }
        })
        .catch(console.error);
    };
  
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [id, isMuted, currentUserId]);  
  
  

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMsg = {
      text,
      sender: currentUserId,
      sender_name: 'You',
      timestamp: new Date().toISOString(),
      is_read: false,
    };

    setMessages(prev => [...prev, newMsg]);
    setText('');

    fetch(`http://localhost:8000/api/accounts/chat/${id}/send/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ text }),
    }).catch(console.error);
  };

  // Typing indicator sent to backend
  const notifyTyping = () => {
    fetch(`http://localhost:8000/api/accounts/chat/${id}/typing/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    }).catch(console.error);
  };

  return (
    <>
   <Navbar />
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">💬 Chat</h4>
        {userType === 'company' && !chatClosed && (
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              fetch(`http://localhost:8000/api/accounts/chat/${id}/close/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrfToken,
                },
              })
                .then(() => setChatClosed(true))
                .catch(console.error);
            }}
          >
            🛑 Close Chat
          </button>
        )}
        <button
  className={`btn btn-sm ${isMuted ? 'btn-secondary' : 'btn-success'} ms-2`}
  onClick={() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('chatMuted', newMuted); // Save preference
  }}
>
  {isMuted ? '🔇 Muted' : '🔊 Sound On'}
</button>

      </div>

      <div
        className="chat-box border p-3 mb-3"
        style={{ height: '400px', overflowY: 'scroll', backgroundColor: '#f8f9fa' }}
        ref={chatBoxRef}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 mb-2 rounded ${
              msg.sender === currentUserId ? 'bg-primary text-white ms-auto text-end' : 'bg-light me-auto text-start'
            }`}
            style={{ maxWidth: '75%' }}
          >
            <div>{msg.text}</div>
            <small className="d-block mt-1">
              {msg.sender_name} · {new Date(msg.timestamp).toLocaleTimeString()}
              {msg.sender === currentUserId && (
                <span className="ms-2 text-success">
                  {msg.is_read ? '✔✔ Read' : '✔ Delivered'}
                </span>
              )}
            </small>
          </div>
        ))}

        {isOtherTyping && <div className="text-muted mt-2">✍️ Other person is typing...</div>}
      </div>

      <div className="input-group">
        <input
          disabled={chatClosed}
          type="text"
          className="form-control"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            notifyTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={chatClosed ? "Chat is closed" : "Type a message..."}
        />
        <button className="btn btn-primary" onClick={sendMessage} disabled={chatClosed}>
          Send
        </button>
      </div>
    </div>
    </>
  );
}

export default ChatPage;