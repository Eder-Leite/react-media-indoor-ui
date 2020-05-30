/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import Toasty from '../../components/toasty';
import { SchemaPleace } from '../../Model.js';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/loading';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect } from 'react';
import ErrorHandler from '../../services/ErrorHandler';
import { TabView, TabPanel } from 'primereact/tabview';
import confirmService from '../../services/confirmService';

function Pleaces(props) {

    const [users, setUsers] = useState([])
    const [groups, setGroups] = useState([]);
    const [pleaces, setPleaces] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [pleace, setPleace] = useState(new SchemaPleace());

    useEffect(() => {
        findAllUsers();
        findAllGroups();
        findAllPleaces();
        document.title = 'Media Indoor | Pleace';
    }, []);

    function newPleace() {
        setActiveIndex(1);
        setPleace(new SchemaPleace());
    }

    function editPleace(value) {
        setPleace(value);
        setActiveIndex(1);
    }

    function validForm() {
        if ((pleace.user_id !== null && pleace.user_id !== undefined)
            && (pleace.group_id !== null && pleace.group_id !== undefined)) {
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
                    deletePleace(value.id);
                }
            }
        );
    }

    async function findAllUsers() {
        Loading.onShow();

        await axios({
            method: 'get',
            url: 'users'
        }).then((resp) => {
            Loading.onHide();

            const data = resp.data.map((user) => ({
                value: user.id,
                label: user.name
            }));

            setUsers(data);
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function findAllGroups() {
        Loading.onShow();

        await axios({
            method: 'get',
            url: 'groups'
        }).then((resp) => {
            Loading.onHide();

            const data = resp.data.map((group) => ({
                value: group.id,
                label: group.description
            }));

            setGroups(data);
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function findAllPleaces() {
        Loading.onShow();

        await axios({
            method: 'get',
            url: 'pleaces'
        }).then((resp) => {
            Loading.onHide();

            setActiveIndex(0);
            setPleaces(resp.data);
            setTotalRecords(resp.data.length);
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function deletePleace(value) {
        Loading.onShow();

        await axios({
            method: 'delete',
            url: `pleaces/${value}`
        }).then((resp) => {
            Loading.onHide();

            findAllPleaces();
            Toasty.success('Success!', 'Record deleted successfully!');
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function savePleace() {

        delete pleace.name;
        delete pleace.updated_at;
        delete pleace.description;

        if (pleace.id) {
            const id = pleace.id;
            delete pleace.id;
            Loading.onShow();

            await axios({
                method: 'put',
                url: `pleaces/${id}`,
                data: pleace
            }).then((resp) => {
                Loading.onHide();

                findAllPleaces();
                Toasty.success('Success!', 'Record edited successfully!');
            }).catch((error) => {
                Loading.onHide();

                ErrorHandler(props, error);
            });
        } else {
            Loading.onShow();

            await axios({
                method: 'post',
                url: `pleaces`,
                data: pleace
            }).then((resp) => {
                Loading.onHide();

                findAllPleaces();
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
                onClick={() => editPleace(rowData)}
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
            Pleaces of list
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
                                        onClick={() => newPleace()}
                                        className='p-button-success'
                                    />
                                </div>
                                <div className='p-toolbar-group-right'>
                                    <Button
                                        tooltip='Search'
                                        icon='pi pi-search'
                                        onClick={findAllPleaces}
                                        style={{ marginRight: '.25em' }}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                </div>
                            </Toolbar>
                            <DataTable
                                rows={5}
                                value={pleaces}
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
                                <Column field='description' header='Group' sortable={true} filter filterMatchMode='contains' />
                                <Column field='name' header='User' sortable={true} filter filterMatchMode='contains' />
                                <Column body={actions} style={{ textAlign: 'center', width: '8em' }} />
                            </DataTable>
                        </TabPanel>
                        <TabPanel disabled header='Register'>
                            <div className='p-grid'>
                                <div className='p-col-12 p-md-2'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Code</label>
                                    <InputText
                                        readOnly={true}
                                        value={pleace.id}
                                    />
                                </div>
                                <div style={{ padding: 0 }} className='p-md-10'></div>
                                <div className='p-col-12 p-md-8'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Group</label>
                                    <Dropdown
                                        showClear={true}
                                        options={groups}
                                        value={pleace.group_id}
                                        onChange={(e) => setPleace({ ...pleace, group_id: e.target.value })}
                                    />
                                </div>
                                <div style={{ padding: 0 }} className='p-md-4'></div>
                                <div className='p-col-12 p-md-8'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>User</label>
                                    <Dropdown
                                        showClear={true}
                                        options={users}
                                        value={pleace.user_id}
                                        onChange={(e) => setPleace({ ...pleace, user_id: e.target.value })}
                                    />
                                </div>
                                <div style={{ padding: 0 }} className='p-md-4'></div>
                                <div className='p-col-12 p-md-4'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Update date</label>
                                    <InputText
                                        readOnly
                                        value={pleace.updated_at}
                                    />
                                </div>
                                <div className='p-col-12 p-md-4'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Creation date</label>
                                    <InputText
                                        readOnly
                                        value={pleace.created_at}
                                    />
                                </div>
                                <div className='p-col-12 p-md-12'>
                                    <Toolbar>
                                        <div className='p-toolbar-group-left'>
                                            <Button
                                                label='Save'
                                                icon='pi pi-check'
                                                disabled={!validForm()}
                                                onClick={() => savePleace(pleace)}
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

export default withRouter(Pleaces);