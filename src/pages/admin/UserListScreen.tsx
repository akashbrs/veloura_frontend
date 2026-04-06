import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2, FiUser, FiShield, FiMail } from 'react-icons/fi';
import { listUsers, deleteUser, updateUserRole, resetAuthState } from '@/redux/slices/authSlice';
import type { AppDispatch, RootState } from '@/redux';
import { toast } from 'react-toastify';

const UserListScreen = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { users, loading, success, userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(listUsers());
        if (success) {
            dispatch(resetAuthState());
        }
    }, [dispatch, success]);

    const deleteHandler = (id: string) => {
        if (id === userInfo?._id) {
            toast.error('You cannot delete your own admin account');
            return;
        }
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(id));
        }
    };

    const roleChangeHandler = (id: string, role: string) => {
        if (id === userInfo?._id) {
            toast.error('You cannot change your own role to avoid lockout');
            return;
        }
        dispatch(updateUserRole({ id, role }));
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
                <p className="text-gray-500 mt-2">Manage user accounts and administrative roles</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Profile</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-400">
                                        {user._id.substring(0, 10)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                                <FiUser />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 uppercase tracking-tight">{user.username}</p>
                                                <div className="flex items-center text-[10px] text-gray-400 font-medium">
                                                    <FiMail className="mr-1" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative inline-block">
                                            <FiShield className={`absolute left-3 top-1/2 -translate-y-1/2 ${user.role === 'admin' ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <select
                                                value={user.role}
                                                onChange={(e) => roleChangeHandler(user._id, e.target.value)}
                                                className={`
                                                    pl-9 pr-8 py-2 rounded-lg text-xs font-bold uppercase appearance-none border-none focus:ring-2 focus:ring-blue-500 transition-all
                                                    ${user.role === 'admin' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-600'}
                                                `}
                                                disabled={user._id === userInfo?._id}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteHandler(user._id)}
                                            className={`p-2 rounded-lg transition-all ${user._id === userInfo?._id ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                            title="Delete User"
                                            disabled={user._id === userInfo?._id}
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserListScreen;
