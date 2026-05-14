import React, { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';

const MyActivity = () => {
    const { userData }= useContext(AuthContext);
    console.log(userData);
    return (
        <div>
            My Activity
        </div>
    );
};

export default MyActivity;