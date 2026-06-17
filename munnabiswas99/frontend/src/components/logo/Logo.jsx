import React from 'react';
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { NavLink } from 'react-router';

const Logo = () => {
    return (
        <NavLink to='/' className='w-fit flex gap-2 items-center border border-white bg-secondary text-secondary-text border-dashed py-1 px-2 rounded-2xl shadow-2xl'>
            <FaFileInvoiceDollar />
            <p className='font-semibold '>Expense Tracker</p>
        </NavLink>
    );
};

export default Logo;