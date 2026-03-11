const CommentList = ({ comments = [] }) => {
  if (!comments.length) {
    return <p className="muted-text">No comments yet. Start the discussion.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment._id} className="comment-card">
          <div className="comment-header">
            <strong>{comment.userId?.name || 'Anonymous'}</strong>
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
