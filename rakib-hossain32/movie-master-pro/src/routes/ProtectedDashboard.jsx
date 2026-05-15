import React from 'react';
import useRole from '../hooks/useRole';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Forbidden from '../pages/Forbidden/Forbidden';

const ProtectedDashboard = ({ children }) => {
    
    const { role, isLoading } = useRole();
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // console.log(role.role)
    if (role.role !== "admin" && role.role !== "user") {
      return <Forbidden />;
    }


    return children
};

export default ProtectedDashboard;