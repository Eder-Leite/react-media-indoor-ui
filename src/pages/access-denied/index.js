import React, { useEffect } from 'react';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router-dom';

import './styles.css';

function AccessDenied(props) {

    function dashboard() {
        props.history.push('/app/dashboard');
    }

    useEffect(() => {
        document.title = 'Media Indoor | Access Denied';
    }, []);

    return (
        <div className='container'>
            <div className='title'>
                <h1>Access Denied!</h1>
            </div>

            <img src='../assets/images/access-denied.png' alt='access denied'></img>
            <div className='div-button'>
                <h3 className='description'>You are not allowed to access this resource.</h3>
                <Button className='button' label='Dashboard' onClick={dashboard} />
            </div>
        </div >
    );
}

export default withRouter(AccessDenied);