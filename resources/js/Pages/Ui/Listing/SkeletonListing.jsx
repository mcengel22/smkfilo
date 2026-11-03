// SkeletonListing.jsx bileşeni
import React from 'react';
import Skeleton from '../../../Components/Skeleton';

const SkeletonListing = () => {
    return (
        <div className="ilan-list">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="card mb-4 p-3">
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-1/3 mb-3 md:mb-0">
                            <Skeleton height="180px" />
                        </div>
                        <div className="w-full md:w-2/3 md:pl-4">
                            <Skeleton height="30px" width="80%" className="mb-3" />
                            <Skeleton height="20px" width="60%" className="mb-2" />
                            <Skeleton height="20px" width="90%" className="mb-2" />
                            <Skeleton height="20px" width="70%" className="mb-2" />

                            <div className="flex justify-between mt-4">
                                <Skeleton height="25px" width="120px" />
                                <Skeleton height="40px" width="100px" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonListing;
