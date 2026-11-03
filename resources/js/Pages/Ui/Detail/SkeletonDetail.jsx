// SkeletonDetail.js bileşeni
import React from 'react';
import Skeleton from '../../../Components/Skeleton';

const SkeletonDetail = () => {
    return (
        <div className="detail">
            <div className="max-w-8xl mx-auto sm:px-2 md:px-2 flex flex-wrap mb-9">
                <div className="w-full lg:w-2/3 px-3">
                    {/* Başlık Skeleton */}
                    <div className="page-title mb-6">
                        <Skeleton height="40px" className="mb-3" />
                        <div className="ilan-inf">
                            <Skeleton height="20px" width="200px" className="mb-2" />
                            <Skeleton height="20px" width="150px" />
                        </div>
                    </div>

                    {/* Galeri Skeleton */}
                    <div className="gallery-area">
                        <Skeleton height="400px" className="mb-4" />
                    </div>

                    {/* Tab Menüsü Skeleton */}
                    <div className="detail-nav">
                        <div className="flex mb-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Skeleton key={i} height="40px" width="100px" className="mr-2" />
                            ))}
                        </div>

                        {/* Tab İçeriği Skeleton */}
                        <div className="tab-content">
                            <div className="card ilan-feature mb-4">
                                <Skeleton height="30px" className="mb-3" />
                                <div className="flex flex-wrap">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-1/2 mb-3">
                                            <Skeleton height="25px" width="90%" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card mb-4">
                                <Skeleton height="30px" className="mb-3" />
                                <Skeleton height="20px" className="mb-2" />
                                <Skeleton height="20px" className="mb-2" />
                                <Skeleton height="20px" className="mb-2" />
                                <Skeleton height="20px" className="mb-2" />
                            </div>

                            <div className="card mb-4">
                                <Skeleton height="30px" className="mb-3" />
                                <div className="flex flex-wrap">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="w-1/3 mb-3">
                                            <Skeleton height="40px" width="90%" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rezervasyon Kartı Skeleton */}
                <div className="w-full lg:w-1/3 px-3">
                    <div className="card sticky top-20">
                        <Skeleton height="400px" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonDetail;
