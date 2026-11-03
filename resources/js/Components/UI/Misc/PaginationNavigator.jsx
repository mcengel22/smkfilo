import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { changePage } from "../../../Repo/Redux/Modules/FilterSlice";

const PaginationNavigator = ({ pagination = null, onPageChange }) => {
    const dispatch = useDispatch();

    // Hooks her render’da burada çağrılıyor:
    const visiblePages = useMemo(() => {
        if (!pagination) return [];

        const { current_page, last_page } = pagination;
        const max = 10;
        let start = 1;
        let pages = [];

        if (last_page <= max) {
            pages = Array.from({ length: last_page }, (_, i) => i + 1);
        } else if (current_page <= 6) {
            pages = Array.from({ length: max }, (_, i) => i + 1);
        } else if (current_page >= last_page - 5) {
            start = last_page - max + 1;
            pages = Array.from({ length: max }, (_, i) => start + i);
        } else {
            start = current_page - 5;
            pages = Array.from({ length: max }, (_, i) => start + i);
        }

        return pages;
    }, [pagination?.current_page, pagination?.last_page]);

    // Şimdi pagination yoksa bile useMemo çağrıldı, ama visiblePages = [] oldu:
    if (!pagination) return null;

    const { current_page, last_page } = pagination;
    const handlePageChange = (page) => {
        if (page !== current_page) {
            if (onPageChange) {
                onPageChange(page);
            } else {
                dispatch(changePage(page));
            }
        }
    };

    return (
        <div className="pagination-navigator">
            <ul className="pagination">
                {/* İlk Sayfa */}
                {current_page > 1 && (
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(1)}
                        >
                            « İlk
                        </button>
                    </li>
                )}

                {/* Önceki Sayfa */}
                {current_page > 1 && (
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(current_page - 1)}
                        >
                            <i className="icon chevron-left"></i>
                        </button>
                    </li>
                )}

                {/* Sayfa Numaraları */}
                {visiblePages.map(page => (
                    <li
                        key={page}
                        className={`page-item ${page === current_page ? "active" : ""}`}
                    >
                        <a
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                            disabled={page === current_page}
                        >
                            {page}
                        </a>
                    </li>
                ))}

                {/* Sonraki Sayfa */}
                {current_page < last_page && (
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(current_page + 1)}
                        >
                            <i className="icon chevron-right"></i>
                        </button>
                    </li>
                )}

                {/* Son Sayfa */}
                {current_page < last_page && (
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(last_page)}
                        >
                            Son »
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default PaginationNavigator;
