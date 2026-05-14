import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import Loading from '../../components/loading/Loading';
import { Navigate } from 'react-router';

const PublicRoute = ({children}) => {
    const { user, loading }=useContext(AuthContext);

    if (loading)
        return <Loading></Loading>;

    if (user && user.email)
        return <Navigate to="/dashboard"></Navigate>;
    
    return children;
};

export default PublicRoute;