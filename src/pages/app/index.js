import axios from 'axios';
import classNames from 'classnames';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import Footer from '../../components/footer';
import React, { useState, useEffect } from 'react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Route, Switch, Redirect, withRouter, NavLink, Link } from 'react-router-dom';

import User from '../user';
import Group from '../group';
import Media from '../media';
import Pleace from '../pleace';
import Dashboard from '../dashboard';
import Publication from '../publication';
import UserProfile from '../user-profile';
import PageNotFound from '../page-not-found';

import './styles.css';

const PrivateRoute = ({ roles, component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            (roles) ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{ pathname: '/access-denied', state: { from: props.location } }} />
                )
        )} />
);

function App() {

    const [user, setUser] = useState('');
    const [menu, setMenu] = useState([]);
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);

    document.title = 'Media Indoor | App';

    useEffect(() => {
        onProfile();
        createMenu();
    }, []);

    function createMenu() {
        setMenu([
            { id: 0, label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/app/dashboard' },
            { id: 1, label: 'Users', icon: 'pi pi-fw pi-user', to: '/app/users' },
            { id: 2, label: 'Groups', icon: 'pi pi-fw pi-users', to: '/app/groups' },
            { id: 3, label: 'Pleaces', icon: 'pi pi-fw pi-th-large', to: '/app/pleaces' },
            { id: 4, label: 'Medias', icon: 'pi pi-fw pi-images', to: '/app/medias' },
            { id: 5, label: 'Publications', icon: 'pi pi-fw pi-desktop', to: '/app/publications' },
            // { id: 6, label: 'Views', icon: 'pi pi-fw pi-play', to: '/app/views' }
        ]);
    }

    function onClick(event) {
        setExpanded(!expanded);
        event.preventDefault();
    }

    function onClickPerfil() {
        setVisible(!visible);
        setExpanded(!expanded);
    }

    async function onClickLogout() {
        await axios({ method: 'post', url: 'logout' });
    }

    async function onProfile() {
        const { data } = await axios.get('user-profile');
        setUser(data.name);
    }

    return (
        <div>
            <Sidebar style={{ border: 'none', background: '#2e3035' }} closeOnEscape={true} visible={visible} fullScreen={false} onHide={() => setVisible(false)}>
                <ScrollPanel style={{ height: '100%' }}>
                    <div className='logo'>
                        <img
                            alt='Logo'
                            src='../assets/images/logoEvolution.png'
                        />
                    </div>
                    <div className='profile'>
                        <div>
                            <img src='../assets/images/avatar.png' alt='' />
                        </div>
                        <button className='p-link profile-link' onClick={onClick}>
                            <span>{user}</span>
                            <i className='pi pi-fw pi-cog' />
                        </button>
                        <ul className={classNames([{ 'profile-expanded': expanded }])}>
                            <li className='li'>
                                <NavLink onClick={onClickPerfil} className='p-link' to='/app/user-profile'>
                                    <i className='pi pi-fw pi-user' />
                                    <span>Profile</span>
                                </NavLink>
                            </li>
                            <li className='li'>
                                <Link className='p-link' onClick={onClickLogout} to='/'>
                                    <i className='pi pi-fw pi-power-off' />
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <ul className='ul'>
                        {menu.map((route) => (
                            <li className='li' key={route.id}>
                                <NavLink onClick={() => { setVisible(!visible); setExpanded(false) }} activeClassName='active' to={route.to}>
                                    <i className={route.icon}></i>
                                    {route.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </ScrollPanel>
            </Sidebar>
            <div id='top' className='top'>
                <Button icon='pi pi-bars' onClick={() => setVisible(!visible)} />
            </div>
            <div className='content'>
                <Switch>
                    <PrivateRoute exact path='/app/dashboard' roles={true} component={Dashboard} />
                    <PrivateRoute exact path='/app/users' roles={true} component={User} />
                    <PrivateRoute exact path='/app/groups' roles={true} component={Group} />
                    <PrivateRoute exact path='/app/pleaces' roles={true} component={Pleace} />
                    <PrivateRoute exact path='/app/medias' roles={true} component={Media} />
                    <PrivateRoute exact path='/app/publications' roles={true} component={Publication} />
                    <PrivateRoute exact path='/app/user-profile' roles={true} component={UserProfile} />

                    <Route path='*' component={PageNotFound} />
                </Switch>
            </div>
            <Footer />
        </div>
    );
}

export default withRouter(App);