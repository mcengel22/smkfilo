import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../Libs/Routes/config';

// Koruma seviyesine göre yönlendirme yapacak bileşen
const ProtectedRoute = ({ requiredType }) => {
    const user = useSelector(state => state.auth.user);

    if (!user) {
        // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }

    // Kullanıcı tipine göre erişim kontrolü
    const hasAccess = () => {
        switch(requiredType) {
            case 'super_admin':
                return user.type === 'super_admin';
            case 'admin_or_higher':
                return ['admin', 'super_admin'].includes(user.type);
            case 'any_user':
                return ['user', 'admin', 'super_admin'].includes(user.type);
            default:
                return false;
        }
    };

    // Eğer gerekli izne sahipse içeriği göster, değilse ana sayfaya yönlendir
    return hasAccess() ? <Outlet /> : <Navigate to={ROUTES.UI.LANDING} replace />;
};

export default ProtectedRoute;
