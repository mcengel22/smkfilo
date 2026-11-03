import React from 'react';

const Comments = ({ comments }) => {  // props olarak rating ve comments alıyoruz
    const commentsCount = comments?.length || 0;  // Yorum sayısını hesaplıyoruz
    return (
        <div className="comment">
            <div className="total-comment">
                <div className="rating">
                    <p className="rating-review">
                        ({commentsCount} Yorum)
                    </p>
                </div>
            </div>
            {/* comments listesini döngüyle render ediyoruz */}
            {comments?.map((comment, index) => (
                <div key={index} className="comments-area">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="user-name">
                            {comment?.email}
                        </div>
                        <div className="rating">
                            <span className="rating-count">
                                {[...Array(5)].map((_, i) => (
                                    <i
                                        key={i}
                                        className={`icon star ${i < comment?.rating ? 'checked' : ''}`}
                                    ></i>
                                ))}
                            </span>
                        </div>
                    </div>
                    <div className="comments">
                        <p>{comment?.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Comments;
