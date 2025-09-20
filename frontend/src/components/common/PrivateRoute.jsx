// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p className="text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;
