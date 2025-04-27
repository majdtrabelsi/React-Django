import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ReplyDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyInput, setReplyInput] = useState({ name: '', message: '' });

  useEffect(() => {
    fetchPostAndReplies();
  }, [postId]);

  const fetchPostAndReplies = async () => {
    try {
      const postResponse = await axios.get(`http://localhost:8000/api/accounts/posts/${postId}/`);
      setPost(postResponse.data);

      const repliesResponse = await axios.get('http://localhost:8000/api/accounts/replies/');
      const filteredReplies = repliesResponse.data.filter((r) => r.post === parseInt(postId));
      setReplies(filteredReplies);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const { name, message } = replyInput;
    if (!name || !message) return;

    try {
      await axios.post('http://localhost:8000/api/accounts/replies/', {
        post: parseInt(postId),
        name,
        message,
      });

      setReplyInput({ name: '', message: '' });
      fetchPostAndReplies(); // Refresh replies
    } catch (err) {
      console.error('Error submitting reply:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      {post && (
        <div style={{ marginBottom: '2rem', backgroundColor: '#f1f1f1', padding: '1rem', borderRadius: '8px' }}>
          <h2>{post.name}</h2>
          <p>{post.message}</p>
        </div>
      )}

      <h3>Replies:</h3>
      {replies.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        replies.map((reply) => (
          <div key={reply.id} style={{ backgroundColor: '#eee', marginBottom: '1rem', padding: '1rem', borderRadius: '5px' }}>
            <strong>{reply.name}</strong>: {reply.message}
          </div>
        ))
      )}

      <hr />
      <h3 style={{ marginTop: '2rem' }}>Leave a Reply</h3>
      <form onSubmit={handleReplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Your Name"
          value={replyInput.name}
          onChange={(e) => setReplyInput({ ...replyInput, name: e.target.value })}
          required
          style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <textarea
          placeholder="Your Reply"
          value={replyInput.message}
          onChange={(e) => setReplyInput({ ...replyInput, message: e.target.value })}
          required
          rows={4}
          style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{ backgroundColor: '#007bff', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px' }}
        >
          Submit Reply
        </button>
      </form>
    </div>
  );
};

export default ReplyDetailPage;
