/* eslint-disable react/jsx-no-target-blank */
import './styles.css';
import React from 'react';

function Footer() {

    return (
        <div id='footer' className='footer'>
            <span className='text'>
                Evolution Sistemas - Media Indoor |
                <a href='https://primefaces.org/primereact/' target='_blank'>
                    <span>  PrimeReact  </span>
                </a>
            </span>
        </div>
    );
}

export default Footer;