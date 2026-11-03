import MainRouter from './MainRouter';
import AuthRouter from './Router/AuthRouter';
import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../Repo/Redux/Auth/AuthSlice';
import Loader from "../../Components/Loader";
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoadingSpinner = memo(() => (
    <Loader />
));

LoadingSpinner.displayName = 'LoadingSpinner';

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [isLoading, setIsLoading] = useState(false);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {/*<AuthRouter/>*/}
            <MainRouter/>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default App;
