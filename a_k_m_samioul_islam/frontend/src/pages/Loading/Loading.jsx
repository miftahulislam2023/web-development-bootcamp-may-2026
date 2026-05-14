import React from 'react';
import Loader from '../../components/loader/Loader';

const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader></Loader>
        </div>
    );
};

export default Loading;