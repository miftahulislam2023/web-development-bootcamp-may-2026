import React, { useContext } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';

const DashboardLayout = () => {
    const { userData, logout } = useContext(AuthContext);
    return (
        <>
            <Sidebar userData={userData} logout={logout}></Sidebar>
        </>
    );
};

export default DashboardLayout;