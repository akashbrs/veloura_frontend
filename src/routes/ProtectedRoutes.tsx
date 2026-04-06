import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux';
import PageLoader from '@/components/ui/PageLoader';

export const ProtectedRoute = () => {
    const { userInfo, loading } = useSelector((state: RootState) => state.auth);

    if (loading) return <PageLoader />;

    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { userInfo, loading } = useSelector((state: RootState) => state.auth);

    if (loading) return <PageLoader />;

    return userInfo && userInfo.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};
