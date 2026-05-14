import React from 'react';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
    return (
        <>
            <Outlet></Outlet>
        </>
    );
};

export default DashboardLayout;