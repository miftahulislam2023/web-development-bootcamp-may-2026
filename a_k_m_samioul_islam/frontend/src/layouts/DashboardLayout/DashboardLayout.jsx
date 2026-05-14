import React, { useContext } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';

const DashboardLayout = () => {
    const { userData } = useContext(AuthContext);
    return (
        <>
            <Sidebar userData={userData}></Sidebar>
        </>
    );
};

export default DashboardLayout;