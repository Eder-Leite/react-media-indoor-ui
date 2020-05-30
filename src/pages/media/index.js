/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import Toasty from '../../components/toasty';
import { SchemaMedia } from '../../Model.js';
import { withRouter } from 'react-router-dom';
import Loading from '../../components/loading';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Player, ControlBar } from 'video-react';
import { InputText } from 'primereact/inputtext';
import React, { useState, useEffect } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import ErrorHandler from '../../services/ErrorHandler';
import { TabView, TabPanel } from 'primereact/tabview';
import confirmService from '../../services/confirmService';

import './styles.css';

const typeVideo = ['video/mp4'];
const urlFiles = 'http://127.0.0.1:3000/uploads';
const typeImage = ['image/png', 'image/jpg', 'image/jpeg'];
const typeMedia = [
    { label: 'IMAGE', value: 'IMAGE' },
    { label: 'VIDEO', value: 'VIDEO' },
    { label: 'FORESCAT', value: 'FORESCAT' }
];

function Media(props) {

    const [medias, setMedias] = useState([]);
    const [player, setPlayer] = useState(null)
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [media, setMedia] = useState(new SchemaMedia());

    useEffect(() => {
        findAllMedias();
        document.title = 'Media Indoor | Media';
    }, []);

    function newMedia() {
        setActiveIndex(1);
        setMedia(new SchemaMedia());
    }

    function editMedia(value) {
        setMedia(value);
        setActiveIndex(1);
    }

    function validForm() {
        if (media.title !== null && media.title !== undefined) {
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
                    deleteMedia(value.id);
                }
            }
        );
    }

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

    async function deleteMedia(value) {
        Loading.onShow();

        await axios({
            method: 'delete',
            url: `medias/${value}`
        }).then((resp) => {
            Loading.onHide();

            findAllMedias();
            Toasty.success('Success!', 'Record deleted successfully!');
        }).catch((error) => {
            Loading.onHide();

            ErrorHandler(props, error);
        });
    }

    async function saveMedia() {

        delete media.description;

        if (media.id) {
            const id = media.id;
            delete media.id;
            Loading.onShow();

            await axios({
                method: 'put',
                url: `medias/${id}`,
                data: media
            }).then((resp) => {
                Loading.onHide();

                findAllMedias();
                Toasty.success('Success!', 'Record edited successfully!');
            }).catch((error) => {
                Loading.onHide();

                ErrorHandler(props, error);
            });
        } else {
            Loading.onShow();

            await axios({
                method: 'post',
                url: `medias`,
                data: media
            }).then((resp) => {
                Loading.onHide();

                findAllMedias();
                Toasty.success('Success!', 'Registration saved successfully!');
            }).catch((error) => {
                Loading.onHide();

                ErrorHandler(props, error);
            });
        }
    }

    function onUpload(e) {
        if (e.target.files[0]) {
            var formData = new FormData();
            var duration = 60;

            const { type } = e.target.files[0];

            if (typeImage.indexOf(type) !== -1) {
                formData.append('IMAGE', e.target.files[0]);
            }

            if (typeVideo.indexOf(type) !== -1) {
                formData.append('VIDEO', e.target.files[0]);

                window.URL = window.URL || window.webkitURL;
                var video = document.createElement('video');
                video.preload = 'metadata';

                video.onloadedmetadata = () => {
                    window.URL.revokeObjectURL(video.src);
                    duration = video.duration;
                }
                video.src = URL.createObjectURL(e.target.files[0]);
            }

            Loading.onShow();

            setTimeout(async () => {
                formData.append('duration', duration.toString());

                if (formData.get('IMAGE') || formData.get('VIDEO')) {


                    await axios.post('medias', formData, {
                    })
                        .then(resp => {
                            findAllMedias();
                            Toasty.success('Success!', 'File Uploaded with success!');
                        })
                        .catch(error => { Loading.onHide(); console.log(error); Toasty.error('Error!', 'Failed to send the file!') });
                } else {
                    Toasty.warn('Warning!', 'File type is incorrect!');
                }

            }, 1000);
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
                onClick={() => editMedia(rowData)}
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
            Medias of list
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
                                        onClick={() => newMedia()}
                                        className='p-button-success'
                                    />
                                </div>
                                <div className='p-toolbar-group-right'>
                                    <Button
                                        tooltip='Search'
                                        icon='pi pi-search'
                                        onClick={findAllMedias}
                                        style={{ marginRight: '.25em' }}
                                        tooltipOptions={{ position: 'top' }}
                                    />
                                </div>
                                <div className='p-toolbar-group-left'>
                                    <div className='input-file'>
                                        <label htmlFor='input-file'>
                                            <i className='pi pi-cloud-upload'></i>
                                            Upload
                                            </label>
                                        <input id='input-file' type='file' onChange={onUpload} />
                                        <span id='file-name'></span>
                                    </div>
                                </div>
                            </Toolbar>
                            <DataTable
                                rows={5}
                                value={medias}
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
                                <Column field='type' header='Type' style={{ width: '6em' }} sortable={true} filter filterMatchMode='contains' />
                                <Column field='title' header='Title' sortable={true} filter filterMatchMode='contains' />
                                <Column field='updated_at' header='Update date' style={{ width: '17em' }} sortable={true} filter filterMatchMode='contains' />
                                <Column field='created_at' header='Creation date' style={{ width: '17em' }} sortable={true} filter filterMatchMode='contains' />
                                <Column field='duration' header='Duration' style={{ width: '6em' }} sortable={true} />
                                <Column body={actions} style={{ textAlign: 'center', width: '8em' }} />
                            </DataTable>
                        </TabPanel>
                        <TabPanel disabled header='Register'>
                            <div className='p-grid'>
                                <div className='p-col-12 p-md-2'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Code</label>
                                    <InputText
                                        readOnly={true}
                                        value={media.id}
                                    />
                                </div>
                                <div className='p-col-12 p-md-10'></div>
                                <div className='p-col-12 p-md-3'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Type</label>
                                    <Dropdown
                                        value={media.type}
                                        options={typeMedia}
                                        disabled={media.id !== undefined}
                                        onChange={(e) => setMedia({ ...media, type: e.target.value })}
                                    />
                                </div>
                                <div className='p-col-12 p-md-3'>
                                    {media.type === 'FORESCAT' ? (
                                        <>
                                            <label htmlFor='in' style={{ fontWeight: 'bold' }}>Code city</label>
                                            <InputNumber
                                                value={media.city}
                                                onChange={(e) => setMedia({ ...media, city: e.target.value })}
                                            />
                                        </>
                                    ) : (null)}
                                </div>
                                <div className='p-col-12 p-md-6'></div>
                                <div className='p-col-12 p-md-6'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Title</label>
                                    <InputText
                                        maxLength={255}
                                        value={media.title}
                                        onChange={(e) => setMedia({ ...media, title: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className='p-col-12 p-md-2'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Duration</label>
                                    <InputNumber
                                        value={media.duration}
                                        disabled={media.type === 'VIDEO' ? true : false}
                                        onChange={(e) => setMedia({ ...media, duration: e.target.value })}
                                    />
                                </div>
                                <div className='p-col-12 p-md-4'></div>
                                <div className='p-col-12 p-md-4'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Directory</label>
                                    <InputText
                                        readOnly
                                        value={media.directory}
                                    />
                                </div>
                                <div className='p-col-12 p-md-4'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Update date</label>
                                    <InputText
                                        readOnly
                                        value={media.updated_at}
                                    />
                                </div>
                                <div className='p-col-12 p-md-4'>
                                    <label htmlFor='in' style={{ fontWeight: 'bold' }}>Creation date</label>
                                    <InputText
                                        readOnly
                                        value={media.created_at}
                                    />
                                </div>
                                {media.type === 'IMAGE' && !!media.directory ? (
                                    <div className='p-col-12 p-md-10 center'>
                                        <div className='image' id='image'>
                                            <img src={`${urlFiles}/${media.directory}`} alt={media.title}>
                                            </img>
                                        </div>
                                    </div>
                                ) : (null)}
                                {media.type === 'VIDEO' && !!media.directory ? (
                                    <>
                                        <div className='p-col-12 p-md-8 center'>
                                            <div className='video' id='video'>
                                                <Player
                                                    muted={true}
                                                    autoPlay={true}
                                                    ref={e => setPlayer(e)}
                                                    src={`${urlFiles}/${media.directory}`}
                                                >
                                                    <ControlBar autoHide={false} />
                                                </Player>
                                            </div>
                                        </div>
                                    </>
                                ) : (null)}
                                <div className='p-col-12 p-md-12'>
                                    <Toolbar>
                                        <div className='p-toolbar-group-left'>
                                            <Button
                                                label='Save'
                                                icon='pi pi-check'
                                                disabled={!validForm()}
                                                onClick={() => saveMedia(media)}
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

export default withRouter(Media);