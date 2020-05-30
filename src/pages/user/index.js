/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { SchemaUser } from '../../Model.js';
import { Toolbar } from 'primereact/toolbar';
import Toasty from '../../components/toasty';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/loading';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import ErrorHandler from '../../services/ErrorHandler';
import { TabView, TabPanel } from 'primereact/tabview';
import React, { useState, useEffect, useRef } from 'react';
import confirmService from '../../services/confirmService';

const filterStatus = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
];

const filterType = [
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'USER', value: 'USER' }
];

function User(props) {

    const textInput = useRef(null);
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [user, setUser] = useState(new SchemaUser());
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        findAllUsers();
        document.title = 'Media Indoor | User';
    }, []);

    function newUser() {
        setActiveIndex(1);
        setUser(new SchemaUser());
        //  document.getElementById('name').focus();
    }

    function editUser(value) {
        setActiveIndex(1);
        setUser({ ...value, password: '' });
        //  document.getElementById('name').focus();
    }

    function IsEmail() {
        if (new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(user.email)) {
            return true;
        }
        else {
            return false;
        }
    }

    function isID() {
        if (user.id !== null && user.id !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    function isPassword() {
        if (isID()) {
            if (user.password !== null && user.password !== undefined) {
                if (user.password.length === 8 || user.password.length === 0) {
                    return true;
                } else {
                    return false;
                }
            } else if (user.password === undefined) {
                return true;
            } else {
                return false;
            }
        } else {
            if (user.password !== null && user.password !== undefined) {
                if (user.password.length === 8) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    function validForm() {
        if ((user.name !== null && user.name !== undefined)
            && (user.type !== null && user.type !== undefined)
            && (user.status !== null && user.status !== undefined)
            && isPassword() && IsEmail()) {
            return true;
        } else {
            return false;
        }
    }

    async function confirmDelete(value) {
        await confirmService.show({
            message: `Do you really want to delete this record (${value.id}) ?`
        }).then(
            (res) => {
                if (res) {
                    deleteUser(value.id);
                }
            }
        );
    }

    async function findAllUsers() {
        Loading.onShow();

        await axios({
            method: 'get',
            url: 'users',
            params: {
                status, name
            },
        }).then((resp) => {
            Loading.onHide();

            setActiveIndex(0);
            setUsers(resp.data);
            setTotalRecords(resp.data.length);
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function deleteUser(value) {
        Loading.onShow();

        await axios({
            method: 'delete',
            url: `users/${value}`
        }).then((resp) => {
            Loading.onHide();

            findAllUsers();
            Toasty.success('Success!', 'Record deleted successfully!');
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function saveUser() {

        if (user.password === '') {
            delete user.password;
        }

        delete user.updated_at;

        if (user.id) {
            const id = user.id;
            delete user.id;
            Loading.onShow();

            await axios({
                method: 'put',
                url: `users/${id}`,
                data: user
            }).then((resp) => {
                Loading.onHide();

                findAllUsers();
                Toasty.success('Success!', 'Record edited successfully!');
            }).catch((error) => {
                Loading.onHide();

                ErrorHandler(props, error);
            });
        } else {
            Loading.onShow();

            await axios({
                method: 'post',
                url: `users`,
                data: user
            }).then((resp) => {
                Loading.onHide();

                findAllUsers();
                Toasty.success('Success!', 'Registration saved successfully!!');
            }).catch((error) => {
                Loading.onHide();

                ErrorHandler(props, error);
            });
        }
    }

    function actions(rowData) {
        return <div>
            <Button
                type='button'
                tooltip='Edit'
                icon='pi pi-pencil'
                className='p-button-warning'
                style={{ marginRight: '.5em' }}
                onClick={() => editUser(rowData)}
                tooltipOptions={{ position: 'top' }}
            />
            <Button
                type='button'
                tooltip='Delete'
                icon='pi pi-trash'
                className='p-button-danger'
                style={{ marginRight: '.5em' }}
                tooltipOptions={{ position: 'top' }}
                onClick={() => confirmDelete(rowData)}
            />
        </div>;
    }

    var footer = 'Number of records ' + totalRecords;

    var header =
        <div className='p-clearfix' style={{ lineHeight: '1.87em' }}>
            Users of list
    </div>;

    return (
        <div className='p-fluid'>
            <div className='p-col-12'>
                <Card>
                    <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                        <TabPanel disabled header='List'>
                            <Toolbar>
                                <div className='p-toolbar-group-left'>
                                    <Button
                                        label='Add'
                                        icon='pi pi-plus'
                                        onClick={() => newUser()}
                                        className='p-button-success'
                                    />
                                </div>
                                <div className='p-toolbar-group-right'>
                                    <Button
                                        tooltip='Search'
                                        icon='pi pi-search'
                                        onClick={findAllUsers}
                                        style={{ marginRight: '.25em' }}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                </div>
                            </Toolbar>

                            <div className='p-grid' style={{ marginTop: 10 }}>
                                <div className='p-col-12 p-md-3'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Status</label>
                                    <Dropdown
                                        value={status}
                                        showClear={true}
                                        options={filterStatus}
                                        onChange={(e) => setStatus(e.target.value)}
                                    />
                                </div>

                                <div style={{ padding: 0 }} className='p-md-9'></div>

                                <div className='p-col-12 p-md-4'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Name</label>
                                    <InputText value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
                                </div>

                                <div style={{ padding: 0 }} className='p-col-12 p-md-8'></div>
                            </div>

                            <div>
                                <DataTable
                                    rows={5}
                                    value={users}
                                    header={header}
                                    footer={footer}
                                    paginator={true}
                                    responsive={true}
                                    style={{ marginTop: 10 }}
                                    totalRecords={totalRecords}
                                    emptyMessage={'No records found!'}
                                    rowsPerPageOptions={[5, 10, 20, 50, 100]}
                                >
                                    <Column field='id' header='Code' style={{ width: '6em' }} sortable={true} />
                                    <Column field='name' header='Name' sortable={true} filter filterMatchMode='contains' />
                                    <Column field='email' header='Email' sortable={true} filter filterMatchMode='contains' />
                                    <Column field='type' header='Type' sortable={true} />
                                    <Column field='status' header='Status' sortable={true} />
                                    <Column body={actions} style={{ textAlign: 'center', width: '8em' }} />
                                </DataTable>
                            </div>
                        </TabPanel>
                        <TabPanel disabled header='Register'>
                            <div className='p-grid'>
                                <div className='p-col-12 p-md-2'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Code</label>
                                    <InputText
                                        readOnly={true}
                                        value={user.id}
                                    />
                                </div>
                                <div style={{ padding: 0 }} className='p-md-10'></div>
                                <div className='p-col-12 p-md-6'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Name</label>
                                    <InputText
                                        id='name'
                                        maxLength={255}
                                        ref={textInput}
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div style={{ padding: 0 }} className='p-md-6'></div>
                                <div className='p-col-12 p-md-6'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Email</label>
                                    <InputText
                                        maxLength={255}
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value.toLowerCase() })}
                                    />
                                </div>
                                <div style={{ padding: 0 }} className='p-md-6'></div>
                                <div className='p-col-12 p-md-2'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Password</label>
                                    <Password
                                        maxLength={8}
                                        keyfilter={/[0-9]+$/}
                                        value={user.password}
                                        weakLabel={'Attention the password entered is weak'}
                                        strongLabel={'Attention the password entered is excellent'}
                                        mediumLabel={'Attention the password entered is reasonable'}
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    />
                                </div>
                                <div className='p-col-12 p-md-2'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Type</label>
                                    <Dropdown
                                        showClear={true}
                                        value={user.type}
                                        options={filterType}
                                        onChange={(e) => setUser({ ...user, type: e.target.value })}
                                    />
                                </div>
                                <div className='p-col-12 p-md-2'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Status</label>
                                    <Dropdown
                                        showClear={true}
                                        value={user.status}
                                        options={filterStatus}
                                        onChange={(e) => setUser({ ...user, status: e.target.value })}
                                    />
                                </div>
                                <div className='p-col-12 p-md-3'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Update date</label>
                                    <InputText
                                        readOnly
                                        value={user.updated_at}
                                    />
                                </div>
                                <div className='p-col-12 p-md-3'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Creation date</label>
                                    <InputText
                                        readOnly
                                        value={user.created_at}
                                    />
                                </div>
                                <div className='p-col-12 p-md-12'>
                                    <Toolbar>
                                        <div className='p-toolbar-group-left'>
                                            <Button
                                                label='Save'
                                                icon='pi pi-check'
                                                disabled={!validForm()}
                                                onClick={() => saveUser(user)}
                                            />
                                        </div>
                                        <div className='p-toolbar-group-right'>
                                            <Button
                                                label='Cancel'
                                                icon='pi pi-times'
                                                className='p-button-danger'
                                                onClick={() => setActiveIndex(0)}
                                            />
                                        </div>
                                    </Toolbar>
                                </div>
                            </div>
                        </TabPanel>
                    </TabView>
                </Card>
            </div>
        </div>
    );
}

export default withRouter(User);