import React, { useState, useEffect } from 'react';
import { useGetAllCommentsQuery, useAdminDeleteCommentMutation } from '../features/api/apiSlice';

const CommentList = () => {
  const { data: comments, isLoading, isError, refetch } = useGetAllCommentsQuery();
  const [deleteComment] = useAdminDeleteCommentMutation();
  const [groupedComments, setGroupedComments] = useState({});

  useEffect(() => {
    
     /* ** Group  comments by rated_username ** */
    if (comments && Array.isArray(comments)) {
     
      const grouped = comments.reduce((acc, comment) => {
        const username = comment.rated_username || 'Not defined';
        if (!acc[username]) {
          acc[username] = [];
        }
        acc[username].push(comment);
        return acc;
      }, {});
      setGroupedComments(grouped);
    }
  }, [comments]);

  const handleDeleteComment = async (commentId) => {
    try {
      
      await deleteComment(commentId);

      
      refetch();
      console.log('Comment delete with success');
    } catch (error) {
      console.error('Error when delete comment :', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Erreur loading comments.</p>;
  }

  return (
    <div className="comment-list">
      <h2>List of Comments</h2>
      {Object.entries(groupedComments).map(([username, userComments]) => (
        <div key={username} className="user-profile">
          <h3>{username}</h3>
          <ul>
            {userComments.map((comment) => (
              <li key={comment.id}>
                <p>{(new Date(comment.send_date)).toLocaleDateString('fr')}</p>
                Id:{comment.id}:
                <p>{comment.comment}</p>
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
