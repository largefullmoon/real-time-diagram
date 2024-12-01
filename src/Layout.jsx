import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!localStorage.getItem("isSigned"))
            navigate('/signin')
        else{
            navigate('/dashboard')
        }
    }, [navigate]);
    return (
        <Outlet />
    );
};

export default Layout;