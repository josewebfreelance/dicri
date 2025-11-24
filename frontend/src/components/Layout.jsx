import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, BarChart, Home } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-primary">DICRI</h1>
                    <p className="text-sm text-gray-500">Evidence Management</p>
                </div>
                <nav className="mt-6">
                    <Link to="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary">
                        <Home className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>
                    <Link to="/expedientes" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary">
                        <FileText className="w-5 h-5 mr-3" />
                        Expedientes
                    </Link>
                    <Link to="/reports" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary">
                        <BarChart className="w-5 h-5 mr-3" />
                        Reports
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{user?.fullName}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
