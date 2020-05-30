import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Loading from '../../components/loading';
import { InputText } from 'primereact/inputtext';
import { Link, withRouter } from 'react-router-dom';
import ErrorHandler from '../../services/ErrorHandler';
import React, { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import './styles.css';

const url = 'login';

function Login(props) {

  const textInput = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    document.title = 'Media Indoor | Login';
  }, []);

  function IsEmail() {
    if (new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email)) {
      return true;
    }
    else {
      return false;
    }
  }

  function isPassword() {
    if (password !== undefined && password !== null) {
      if (password.length === 8) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function validForm() {
    if (IsEmail() && isPassword()) {
      return true;
    } else {
      return false;
    }
  }

  function setFocusPassword() {
    document.getElementById('password').focus();
  }

  async function login() {
    Loading.onShow();

    const body = {
      email, password
    };

    await axios({
      method: 'post',
      url: url,
      data: body
    }).then(resp => {
      Loading.onHide();
      setEmail('');
      setPassword('');
      props.history.push({ pathname: '/app/dashboard' });

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

      <Card className='card-login'>
        <h2 >Welcome back!</h2>
        <h4>Log in to access your dashboard and settings.</h4>
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
                onBlur={setFocusPassword}
                onChange={(event) => setEmail(event.target.value.toLowerCase())}
              />
            </div>
          </div>
        </div>

        <div className='p-grid p-fluid'>
          <div className='p-col-12 p-md-12'>
            <div className='password'>
              <label>Password</label>
              <Link to='/reset-password' style={{ fontWeight: 'bold' }}>Forgot password?</Link>
            </div>
          </div>
          <div className='p-col-12 p-md-12'>
            <div className='p-inputgroup'>
              <span className='p-inputgroup-addon'>
                <i className='pi pi-lock'></i>
              </span>
              <InputText
                id='password'
                maxLength={8}
                placeholder=''
                type='password'
                ref={textInput}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }} className='p-fluid'>
          <Button disabled={!validForm()} onClick={login} label='LOG IN' />
        </div>
      </Card>
    </div>
  );
}

//signup

export default withRouter(Login);
