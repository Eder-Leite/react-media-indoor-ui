/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { Panel } from 'primereact/panel';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Toasty from '../../components/toasty';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/loading';
import { Dropdown } from 'primereact/dropdown';
import { OrderList } from 'primereact/orderlist';
import { DataTable } from 'primereact/datatable';
import React, { useState, useEffect } from 'react';
import ErrorHandler from '../../services/ErrorHandler';
import confirmService from '../../services/confirmService';


import './styles.css';

const typesPublication = [
    { label: 'GROUP', value: 'GROUP' },
    { label: 'PLEACE', value: 'PLEACE' }
];

function Publication(props) {

    const [medias, setMedias] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [listPublication, setListPublication] = useState([]);
    const [totalRecordsType, setTotalRecordsType] = useState(0);
    const [typePublication, setTypePublication] = useState(null);
    const [listTypePublication, setListTypePublication] = useState([]);
    const [typePublicationSelection, setTypePublicationSelection] = useState(null);

    useEffect(() => {
        findAllMedias();
        document.title = 'Media Indoor | Publication';
    }, []);

    async function findAllMedias() {
        Loading.onShow();

        await axios({
            method: 'get',
            url: 'medias'
        }).then((resp) => {
            Loading.onHide();
            setMedias(resp.data);
            setTotalRecords(resp.data.length);
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function findAllUsers() {
        Loading.onShow();

        await axios({
            method: 'get',
            url: 'users'
        }).then((resp) => {
            Loading.onHide();
            setListTypePublication(resp.data.map(user => ({
                id: user.id,
                user_id: user.id,
                group_id: null,
                description: user.name
            })));
            setTotalRecordsType(resp.data.length);
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
            setListTypePublication(resp.data.map(group => ({
                id: group.id,
                user_id: null,
                group_id: group.id,
                description: group.description
            })));
            setTotalRecordsType(resp.data.length);
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function findAllPublication(event) {
        Loading.onShow();

        var params = {};
        const { group_id, user_id } = event;

        if (group_id) {
            params = { group_id };
        }

        if (user_id) {
            params = { user_id };
        }

        await axios({
            method: 'get',
            url: 'publications',
            params: params,
        }).then((resp) => {
            Loading.onHide();
            setListPublication(resp.data);
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    function onChangeTypePublication(event) {
        setTypePublication(event);

        if (event === 'GROUP') {
            findAllGroups();
        } else {
            findAllUsers();
        }
        setListPublication([]);
        setTypePublicationSelection(null);
    }

    function onSelectionChange(event) {
        //  console.log(event);
        if (!!event) {
            findAllPublication(event);
            setTypePublicationSelection(event);
        } else {
            setListPublication([]);
            setTypePublicationSelection(null);
        }
    }

    function addListPublication(rowData) {
        Loading.onShow();

        return new Promise((result) => {
            setTimeout(() => {
                const data = {
                    id: undefined,
                    ordination: undefined,
                    group_id: typePublicationSelection.group_id,
                    user_id: typePublicationSelection.user_id,
                    media_id: rowData.id,
                    title: rowData.title
                };

                var values = [];
                listPublication.map((pub) => (
                    values.push(pub)
                ));

                values.push(data);

                setListPublication(values);

                Loading.onHide();
                result(true);
            }, 300);
        });
    }

    async function sendPublication() {
        var values = [];
        listPublication.map((media, i) => {
            let value = media;
            value.ordination = i;
            values.push(value);
        });

        const { user_id, group_id } = typePublicationSelection;
        const data = {
            user_id,
            group_id,
            medias: values
        };

        // console.log(data);

        Loading.onShow();

        await axios({
            method: 'post',
            url: 'publications/process',
            data: data,
        }).then((resp) => {
            Loading.onHide();

            setListPublication([]);
            setTypePublicationSelection(null);
            Toasty.success('Success!', 'Publication successfully created!');
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    function removeListPublication(item) {
        // console.log(item);

        var values = [];
        listPublication.map((media) => {
            let value = media;
            values.push(value);
        });

        values = values.filter((e) => e !== item);

        setListPublication(values);
    }

    async function confirmDelete() {
        await confirmService.show({
            message: `Really want to perform this action?`
        }).then(
            (res) => {
                if (res) {
                    sendPublication();
                }
            }
        );
    }

    function itemTemplate(item) {
        return (
            <div className='item'>
                <label>
                    {`${item.media_id} - ${item.title}`}
                </label>
                <i className='pi pi-times' onClick={() => removeListPublication(item)}></i>
            </div>
        );
    }

    function actionsMedia(rowData) {
        return <div>
            <Button
                type='button'
                tooltip='Send'
                icon='pi pi-arrow-right'
                className='p-p-button-secondary'
                style={{ marginRight: '.5em' }}
                tooltipOptions={{ position: 'top' }}
                onClick={() => addListPublication(rowData)}
                disabled={!!typePublicationSelection ? false : true}
            />
        </div>;
    }

    var footer = 'Number of records ' + totalRecords;

    var header =
        <div className='p-clearfix' style={{ lineHeight: '1.87em' }}>
            Medias of list
    </div>;

    return (
        <div className='p-fluid'>
            <div className='p-col-12'>
                <div className='p-grid'>

                    <div className='p-col-12 p-md-4'>
                        <DataTable
                            rows={10}
                            value={medias}
                            header={header}
                            footer={footer}
                            paginator={true}
                            responsive={true}
                            totalRecords={totalRecords}
                            emptyMessage={'No records found!'}
                            rowsPerPageOptions={[10, 20, 50, 100]}
                        >
                            <Column field='id' header='Code' style={{ width: '5em' }} sortable={true} />
                            <Column field='type' header='Type' style={{ width: '5em' }} />
                            <Column field='title' header='Title' />
                            <Column body={actionsMedia} style={{ textAlign: 'center', width: '4em' }} />
                        </DataTable>
                    </div>
                    <div className='p-col-12 p-md-4'>
                        <Panel header='Type publication'>
                            <Dropdown
                                value={typePublication}
                                options={typesPublication}
                                onChange={(e) => onChangeTypePublication(e.target.value)}
                            />
                            <DataTable
                                rows={10}
                                paginator={true}
                                responsive={true}
                                selectionMode='single'
                                value={listTypePublication}
                                style={{ marginTop: '10px' }}
                                totalRecords={totalRecordsType}
                                emptyMessage={'No records found!'}
                                selection={typePublicationSelection}
                                rowsPerPageOptions={[10, 20, 50, 100]}
                                onSelectionChange={(e) => onSelectionChange(e.value)}
                            >
                                <Column field='id' header='Code' style={{ width: '5em' }} sortable={true} />
                                <Column field='description' header='Description' />
                            </DataTable>
                        </Panel>
                    </div>
                    <div className='p-col-12 p-md-4'>
                        <OrderList
                            dragdrop={true}
                            responsive={true}
                            value={listPublication}
                            itemTemplate={itemTemplate}
                            header='List of publication'
                            onChange={(e) => setListPublication(e.value)}
                        />
                        <div className='publication-button'>
                            <Button
                                label='Publication'
                                onClick={confirmDelete}
                                className='p-p-button-secondary'
                                disabled={typePublicationSelection === null}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(Publication);