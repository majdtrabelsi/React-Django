import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import

const CommunityPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState([]);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [replies, setReplies] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  
  // Load categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/accounts/categories/');
      setCategories(response.data);
      if (!selectedCategory && response.data.length > 0) {
        setSelectedCategory(response.data[0].name);
      }
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };
  

  // Load posts for selected category
  const fetchPosts = async () => {
    if (!selectedCategory) return;
    try {
      const response = await axios.get('http://localhost:8000/api/accounts/posts/');
      const filtered = response.data.filter((post) => post.category === selectedCategory);
      setPosts(filtered);
    } catch (err) {
      console.error('Error fetching posts', err);
    }
  };

  // On category change
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  // Submit new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && message && selectedCategory) {
      try {
        await axios.post('http://localhost:8000/api/accounts/posts/', {
          name,
          message,
          category: selectedCategory,
        });
        setName('');
        setMessage('');
        fetchPosts();
      } catch (err) {
        console.error('Error posting message', err);
      }
    }
  };

  // Create new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (newCategory.trim() === '') return;
    try {
      await axios.post('http://localhost:8000/api/accounts/categories/', { name: newCategory.trim() });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      console.error('Error creating category', err);
    }
  };
  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8000/api/accounts/categories/${categoryId}/`);
      // Reset selected category if it's the one being deleted
      if (categories.find(c => c.id === categoryId)?.name === selectedCategory) {
        setSelectedCategory(null);
        setPosts([]);
      }
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category', err);
    }
  };
  


  const fetchReplies = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/accounts/replies/');
      const grouped = {};
      response.data.forEach((reply) => {
        if (!grouped[reply.post]) grouped[reply.post] = [];
        grouped[reply.post].push(reply);
      });
      setReplies(grouped);
    } catch (err) {
      console.error('Error fetching replies', err);
    }
  };
  
  useEffect(() => {
    fetchPosts();
    fetchReplies();
  }, [selectedCategory]);

  
  const handleReplySubmit = async (e, postId) => {
    e.preventDefault();
    const reply = replyInputs[postId];
    if (!reply?.name || !reply?.message) return;
  
    try {
      await axios.post('http://localhost:8000/api/accounts/replies/', {
        post: postId,
        name: reply.name,
        message: reply.message,
      });
      setReplyInputs((prev) => ({ ...prev, [postId]: { name: '', message: '' } }));
      fetchReplies();
    } catch (err) {
      console.error('Error submitting reply', err);
    }
  };
  
  const navigate = useNavigate(); // Initialize navigate
  








  return (
    <div style={styles.pageContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Categories</h2>

        {categories.map((cat) => (
            <div key={cat.id} style={styles.categoryRow}>
                <button
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                    ...styles.sidebarButton,
                    backgroundColor: selectedCategory === cat.name ? '#007bff' : 'transparent',
                    color: selectedCategory === cat.name ? '#fff' : '#333',
                }}
                >
                {cat.name}
                </button>
                
            </div>
            ))}

        
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.heading}>Community - {selectedCategory}</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>Post a message in <span style={{ color: '#007bff' }}>{selectedCategory}</span></h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            style={styles.input}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            required
            rows={4}
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Post</button>
        </form>
        <div style={styles.messagesContainer}>
        {posts.length === 0 ? (
          <p style={styles.emptyMessage}>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{ ...styles.messageCard, cursor: 'pointer' }}
              onClick={() => navigate(`/replies/${post.id}`)}
            >
              <h3 style={styles.messageName}>{post.name}</h3>
              <p>{post.message}</p>
              <p style={{ color: '#007bff' }}>View Replies →</p>
            </div>
          ))
        )}
      </div>

        
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f7f7f7',
    padding: '1rem',
    borderRight: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  sidebarTitle: {
    marginBottom: '1rem',
    fontSize: '18px',
    color: '#333',
  },
  sidebarButton: {
    padding: '10px',
    marginBottom: '8px',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    transition: '0.3s',
  },
  main: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#fff',
    overflowY: 'auto',
  },
  heading: {
    color: '#333',
    marginBottom: '1rem',
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  messageCard: {
    backgroundColor: '#f1f1f1',
    padding: '1rem',
    borderRadius: '8px',
  },
  messageName: {
    color: '#007bff',
    marginBottom: '0.3rem',
  },
  emptyMessage: {
    fontStyle: 'italic',
    color: '#aaa',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '2rem',
  },
  categoryRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '8px',
  },
  deleteButton: {
    marginLeft: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#cc0000',
    cursor: 'pointer',
    fontSize: '16px',
  },
  repliesContainer: {
    marginTop: '1rem',
    paddingLeft: '1rem',
    borderLeft: '2px solid #ddd',
  },
  replyCard: {
    backgroundColor: '#f0f0f0',
    padding: '0.5rem',
    borderRadius: '5px',
    marginBottom: '0.5rem',
    fontSize: '14px',
  },
  replyForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  replyInput: {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  replyButton: {
    alignSelf: 'flex-start',
    padding: '6px 12px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  

};

export default CommunityPage;
