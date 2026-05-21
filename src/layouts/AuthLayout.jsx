
import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className='w-'>
            <Outlet></Outlet>         
            
        </div>
    );
};

export default AuthLayout;