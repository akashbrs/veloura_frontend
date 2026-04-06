import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux';

const AdminRoute = () => {
    const { userInfo, loading } = useSelector((state: RootState) => state.auth);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#f2f0ed]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!userInfo || userInfo.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
