/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { SchemaGroup } from '../../Model.js';
import { Toolbar } from 'primereact/toolbar';
import Toasty from '../../components/toasty';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/loading';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import ErrorHandler from '../../services/ErrorHandler';
import { TabView, TabPanel } from 'primereact/tabview';
import confirmService from '../../services/confirmService';
import React, { useState, useEffect, useRef } from 'react';

function Group(props) {

    const textInput = useRef(null);
    const [groups, setGroups] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [group, setGroup] = useState(new SchemaGroup());

    useEffect(() => {
        findAllGroups();
        document.title = 'Media Indoor | Group';
    }, []);

    function newGroup() {
        setActiveIndex(1);
        setGroup(new SchemaGroup());
        //  document.getElementById('description').focus();
    }

    function editgroup(value) {
        setActiveIndex(1);
        setGroup({ ...value, password: '' });
        // document.getElementById('description').focus();
    }

    function validForm() {
        if ((group.description !== null && group.description !== undefined && group.description.length >= 3)) {
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
                    deleteGroup(value.id);
                }
            }
        );
    }

    async function findAllGroups() {
        Loading.onShow();

        await axios({
            method: 'get',
            url: 'groups',
        }).then((resp) => {
            Loading.onHide();

            setActiveIndex(0);
            setGroups(resp.data);
            setTotalRecords(resp.data.length);
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function deleteGroup(value) {
        Loading.onShow();

        await axios({
            method: 'delete',
            url: `groups/${value}`
        }).then((resp) => {
            Loading.onHide();

            findAllGroups();
            Toasty.success('Success!', 'Record deleted successfully!');
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function saveGroup() {

        delete group.updated_at;

        if (group.id) {
            const id = group.id;
            delete group.id;
            Loading.onShow();

            await axios({
                method: 'put',
                url: `groups/${id}`,
                data: group
            }).then((resp) => {
                Loading.onHide();

                findAllGroups();
                Toasty.success('Success!', 'Record edited successfully!');
            }).catch((error) => {
                Loading.onHide();

                ErrorHandler(props, error);
            });
        } else {
            Loading.onShow();

            await axios({
                method: 'post',
                url: `groups`,
                data: group
            }).then((resp) => {
                Loading.onHide();

                findAllGroups();
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
                onClick={() => editgroup(rowData)}
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
            Groups of list
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
                                        onClick={() => newGroup()}
                                        className='p-button-success'
                                    />
                                </div>
                                <div className='p-toolbar-group-right'>
                                    <Button
                                        tooltip='Search'
                                        icon='pi pi-search'
                                        onClick={findAllGroups}
                                        style={{ marginRight: '.25em' }}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                </div>
                            </Toolbar>
                            <DataTable
                                rows={5}
                                value={groups}
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
                                <Column field='description' header='description' sortable={true} filter filterMatchMode='contains' />
                                <Column body={actions} style={{ textAlign: 'center', width: '8em' }} />
                            </DataTable>
                        </TabPanel>
                        <TabPanel disabled header='Register'>
                            <div className='p-grid'>
                                <div className='p-col-12 p-md-2'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Code</label>
                                    <InputText
                                        readOnly={true}
                                        value={group.id}
                                    />
                                </div>
                                <div style={{ padding: 0 }} className='p-md-10'></div>
                                <div className='p-col-12 p-md-6'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Description</label>
                                    <InputText
                                        ref={textInput}
                                        id='description'
                                        maxLength={255}
                                        value={group.description}
                                        onChange={(e) => setGroup({ ...group, description: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className='p-col-12 p-md-3'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Update date</label>
                                    <InputText
                                        readOnly
                                        value={group.updated_at}
                                    />
                                </div>
                                <div className='p-col-12 p-md-3'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Creation date</label>
                                    <InputText
                                        readOnly
                                        value={group.created_at}
                                    />
                                </div>
                                <div className='p-col-12 p-md-12'>
                                    <Toolbar>
                                        <div className='p-toolbar-group-left'>
                                            <Button
                                                label='Save'
                                                icon='pi pi-check'
                                                disabled={!validForm()}
                                                onClick={() => saveGroup(group)}
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

export default withRouter(Group);