import React from 'react';
import Skeleton from '@/Components/Skeleton';

const SkeletonTable = () => {
    // Create 5 skeleton rows
    return (
        <table>
            <thead>
                <tr>
                    <th>Başlık</th>
                    <th>Açıklama</th>
                    <th>Canonical URL</th>
                    <th>İlan Başlığı</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
                {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item}>
                        <td><Skeleton height="20px" width="80%" /></td>
                        <td><Skeleton height="20px" width="90%" /></td>
                        <td><Skeleton height="20px" width="70%" /></td>
                        <td><Skeleton height="20px" width="60%" /></td>
                        <td className="actions">
                            <div className="flex">
                                <Skeleton height="30px" width="30px" className="mr-2" />
                                <Skeleton height="30px" width="30px" />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SkeletonTable;
