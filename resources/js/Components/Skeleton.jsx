import React from 'react';

const Skeleton = ({ height, width, className }) => {
    return (
        <div className={`skeleton-container ${className}`}>
            <div
                className="animate-pulse relative overflow-hidden bg-gray-200 rounded"
                style={{
                    height: height || '20px',
                    width: width || '100%'
                }}
            >
                {/* Parıldama (Shimmer) Efekti */}
                <div className="shimmer-effect"></div>
            </div>

            {/* Global stil ekleme */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .skeleton-container {
                    position: relative;
                    overflow: hidden;
                }

                .shimmer-effect {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.3) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    animation: shimmer 1.5s infinite;
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(200%);
                    }
                }
                `
            }} />
        </div>
    );
};

export default Skeleton;
