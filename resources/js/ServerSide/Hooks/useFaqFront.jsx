import { useState, useEffect, useCallback } from "react";
import API_CONFIG from "@/ServerSide/EndPoints.jsx";
import { apiService } from "@/ServerSide/Load.jsx";

export const useFaqFront = (autoFetch = true) => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const FAQ_URL = API_CONFIG?.ENDPOINTS?.FAQ?.FAQ;

    const fetchFaqs = useCallback(async () => {
        if (!FAQ_URL) {
            setError("FAQ endpoint bulunamadı.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await apiService.get(FAQ_URL, {
                params: {
                    page: 1,
                    per_page: 10,
                    sort: "id",
                    direction: "desc",
                },
            });

            setFaqs(response?.data?.data || []);
        } catch (err) {
            setError("FAQ verileri yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    }, [FAQ_URL]);

    useEffect(() => {
        if (autoFetch) fetchFaqs();
    }, [autoFetch, fetchFaqs]);

    return {
        faqs,
        loading,
        error,
        refetch: fetchFaqs,
        setFaqs,
    };
};
