import React, { memo, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router } from "react-router-dom"
import { useSelector } from "react-redux";
import Loader from "../Components/Loader";
import {useAuth} from "../ServerSide/Hooks/Auth/useAuth";

const Load = lazy(() => import('./StartApp/Load'));

const LoadingSpinner = memo(() => (
    <>
        <Loader/>
    </>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const App = () => {
    const { checkAuth } = useAuth();
    const isAuthChecked = useSelector(state => state.auth.isAuthChecked);
    const isLoading = useSelector(state => state.auth.loading);

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            if (!isAuthChecked && mounted) {
                try {
                    await checkAuth();
                } catch (error) {
                    mounted && console.error('Auth kontrolü sırasında hata:', error);
                }
            }
        };

        initAuth();
        return () => { mounted = false; };
    }, [checkAuth]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Router>
            <Suspense fallback={<LoadingSpinner />}>
                <Load />
            </Suspense>
        </Router>
    );
};

export default memo(App);
