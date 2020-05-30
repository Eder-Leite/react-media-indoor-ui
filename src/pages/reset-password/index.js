import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Toasty from '../../components/toasty';
import Loading from '../../components/loading';
import { InputText } from 'primereact/inputtext';
import { Link, withRouter } from 'react-router-dom';
import ErrorHandler from '../../services/ErrorHandler';
import React, { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import './styles.css';

const url = 'reset-password';

function ResetPassword(props) {

  const textInput = useRef(null);
  const [email, setEmail] = useState('eder@evolutionsistemas.com.br');
  const [username, setUsername] = useState('EDER APARECIDO LEITE');

  useEffect(() => {
    document.title = 'Media Indoor | Reset Password';
  }, []);

  function IsEmail() {
    if (new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email)) {
      return true;
    }
    else {
      return false;
    }
  }

  function isUserName() {
    if (username !== undefined && username !== null) {
      if (username.length >= 3) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function validaFormulario() {
    if (IsEmail() && isUserName()) {
      return true;
    } else {
      return false;
    }
  }

  function setFocusUsername() {
    document.getElementById('username').focus();
  }

  async function login() {
    Loading.onShow();

    const body = {
      email, username
    };

    await axios({
      method: 'post',
      url: url,
      data: body
    }).then(resp => {
      Loading.onHide();
      setEmail('');
      setUsername('');
      Toasty.success('Success!', 'A temporary password has been sent to your email!');
      props.history.push({ pathname: '/' })

    })
      .catch(error => {
        Loading.onHide();
        ErrorHandler(props, error);
      });
  }

  return (
    <div className='container'>
      <img
        alt='Logo'
        style={{ marginBottom: 25 }}
        src='../assets/images/logoEvolution.png'
      />

      <Card className='card-reset-password'>
        <h2 >Reset your password!</h2>
        <h4>Enter a username complete and valid e-mail to receive instructions on how to reset your password.</h4>
        <div className='p-grid p-fluid'>
          <div className='p-col-12 p-md-12'>
            <label>Email</label>
          </div>
          <div className='p-col-12 p-md-12'>
            <div className='p-inputgroup'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-envelope'></i>
              </span>
              <InputText
                type='email'
                value={email}
                placeholder=''
                maxLength={255}
                onBlur={setFocusUsername}
                onChange={(event) => setEmail(event.target.value.toLowerCase())}
              />
            </div>
          </div>
        </div>

        <div className='p-grid p-fluid'>
          <div className='p-col-12 p-md-12'>
            <div className='username'>
              <label>Username</label>
              <Link to='/' style={{ fontWeight: 'bold' }}>Log in</Link>
            </div>
          </div>
          <div className='p-col-12 p-md-12'>
            <div className='p-inputgroup'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-user'></i>
              </span>
              <InputText
                id='username'
                maxLength={255}
                placeholder=''
                ref={textInput}
                value={username}
                onChange={(event) => setUsername(event.target.value.toUpperCase())}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }} className='p-fluid'>
          <Button disabled={!validaFormulario()} onClick={login} label='RESSET PASSWORD' />
        </div>
      </Card>
    </div>
  );
}

//signup

export default withRouter(ResetPassword);
