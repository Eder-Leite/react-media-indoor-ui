/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Toasty from '../../components/toasty';
import { withRouter } from 'react-router-dom';
import { Password } from 'primereact/password';
import Loading from '../../components/loading';
import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect } from 'react';
import { SchemaUserProfile } from '../../Model.js';
import ErrorHandler from '../../services/ErrorHandler';

function ResetPassword() {
    this.password = '';
    this.newPassword = '';
    this.confirmPassword = '';
}

function UserProfile(props) {

    const [user, setUser] = useState(new SchemaUserProfile());
    const [resetPassword, setResetPassword] = useState(new ResetPassword());


    useEffect(() => {
        findUser();
    }, []);

    async function findUser() {
        Loading.onShow();

        await axios({
            method: 'get',
            url: `user-profile`
        }).then((resp) => {

            Loading.onHide();
            setUser(resp.data);
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    function handleClean() {
        setResetPassword(new ResetPassword());
    }

    function validForm() {
        if (resetPassword.password.length === 8) {
            if ((resetPassword.newPassword.length === 8) && (resetPassword.newPassword === resetPassword.confirmPassword)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async function handlePassword() {
        Loading.onShow();

        await axios({
            method: 'post',
            url: 'alter-password',
            data: resetPassword,
        }).then(resp => {
            Loading.onHide();
            setResetPassword(new ResetPassword());
            Toasty.success('Sucess!', 'Password changed successfully!');
        })
            .catch(error => {
                Loading.onHide();
                ErrorHandler(props, error);
            });

    }

    return (
        <div className='p-fluid'>
            <div className='p-grid'>
                <div className='p-col-12 p-md-8'>
                    <Card title='User profile'>
                        <div className='p-grid'>
                            <div className='p-col-12 p-md-3'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>Code</label>
                                <InputText
                                    readOnly={true}
                                    value={user.id}
                                />
                            </div>
                            <div className='p-col-12 p-md-12'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>Email</label>
                                <InputText
                                    readOnly={true}
                                    value={user.email}
                                />
                            </div>
                            <div className='p-col-12 p-md-12'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>Name</label>
                                <InputText
                                    readOnly={true}
                                    value={user.name}
                                />
                            </div>
                            <div className='p-col-12 p-md-2'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>Type</label>
                                <InputText
                                    readOnly={true}
                                    value={user.type}
                                />
                            </div>
                            <div className='p-col-12 p-md-2'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>Status</label>
                                <InputText
                                    readOnly={true}
                                    value={user.status}
                                />
                            </div>
                            <div className='p-col-12 p-md-4'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>Update date</label>
                                <InputText
                                    readOnly
                                    value={user.updated_at}
                                />
                            </div>
                            <div className='p-col-12 p-md-4'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>Creation date</label>
                                <InputText
                                    readOnly
                                    value={user.created_at}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className='p-col-12 p-md-4'>
                    <Card className='p-col-12 p-md-12' title='Change password'>
                        <div className='p-grid'>
                            <div className='p-col-12 p-md-12'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>Current password</label>
                                <Password
                                    maxLength={8}
                                    feedback={false}
                                    value={resetPassword.password}
                                    onChange={(e) => setResetPassword({ ...resetPassword, password: e.target.value })}
                                />
                            </div>

                            <div className='p-col-12 p-md-12'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>New password</label>
                                <Password
                                    maxLength={8}
                                    value={resetPassword.newPassword}
                                    weakLabel={'Attention the password entered is weak'}
                                    strongLabel={'Attention the password entered is excellent'}
                                    mediumLabel={'Attention the password entered is reasonable'}
                                    onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
                                />
                            </div>

                            <div className='p-col-12 p-md-12'>
                                <label htmlFor='in' style={{ fontWeight: 'bold' }}>Confirm password</label>
                                <Password
                                    maxLength={8}
                                    feedback={false}
                                    value={resetPassword.confirmPassword}
                                    onChange={(e) => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })}
                                />
                            </div>
                            <div className='p-col-12 p-md-6'>
                                <Button
                                    label='Enviar'
                                    icon='pi pi-check'
                                    disabled={!validForm()}
                                    onClick={handlePassword}
                                    className='p-button-rounded'
                                />
                            </div>
                            <div className='p-col-12 p-md-6'>
                                <Button
                                    label='Limpar'
                                    onClick={handleClean}
                                    icon='pi pi-circle-off'
                                    className='p-button-rounded p-button-secondary'
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default withRouter(UserProfile);