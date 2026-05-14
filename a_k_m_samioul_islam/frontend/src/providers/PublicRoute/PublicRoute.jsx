import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import { Navigate } from 'react-router';
import Loading from '../../pages/Loading/Loading';

const PublicRoute = ({children}) => {
    const { user, loading }=useContext(AuthContext);

    if (loading)
        return <Loading></Loading>;

    if (user && user.email)
        return <Navigate to="/dashboard" replace />;
    
    return children;
};

export default PublicRoute;