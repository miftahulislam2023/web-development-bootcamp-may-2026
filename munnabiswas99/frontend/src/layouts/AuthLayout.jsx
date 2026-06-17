import React from 'react';
import Logo from "../components/logo/Logo";
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className=''>
            <Outlet/>
        </div>
    );
};

export default AuthLayout;