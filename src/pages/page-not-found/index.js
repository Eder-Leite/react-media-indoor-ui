import React, { useEffect } from 'react';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router-dom';

import './styles.css';

function PageNotFound(props) {

    function dashboard() {
        props.history.push('/app/dashboard');
    }

    useEffect(() => {
        document.title = 'Media Indoor | Page not found';
    }, []);

    return (
        <div className='container'>
            <div className='title'>
                <h1>Page not found!</h1>
            </div>

            <img src='../assets/images/page-not-found.png' alt='page not found'></img>
            <div className='div-button'>
                <h3 className='description'>The resource you are looking for does not exist.</h3>
                <Button className='button' label='Dashboard' onClick={dashboard} />
            </div>
        </div >
    );
}

export default withRouter(PageNotFound);