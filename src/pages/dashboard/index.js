import axios from 'axios';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Player, ControlBar } from 'video-react';

import './styles.css';

const url = 'http://127.0.0.1:3333/uploads';

var sources = [
    { src: '', type: 'IMAGE', duration: 1 }];

class Dasboard extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            index: 0,
            isVideo: false,
            isImage: false,
            poster: null,
            sources: sources,
            source: null,
            duration: 0,
            currentTime: 0,
        };

        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.load = this.load.bind(this);
        this.changeCurrentTime = this.changeCurrentTime.bind(this);
        this.seek = this.seek.bind(this);
        this.changePlaybackRateRate = this.changePlaybackRateRate.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
        this.setMuted = this.setMuted.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);

        setTimeout(() => {
            this.publicationUsers();
        }, 5000);

    }

    componentDidMount() {
        this.player.subscribeToStateChange(this.handleStateChange.bind(this));
    }


    setMuted(muted) {
        return () => {
            this.player.muted = muted;
        };
    }

    handleStateChange(state) {
        const { player, duration, currentTime } = state;
        this.setState({ player, duration, currentTime });
    }

    play() {
        this.player.play();
        console.log(this.state.duration, this.state.currentTime);
    }

    toggleFullscreen() {
        this.player.toggleFullscreen();
    }

    pause() {
        this.player.pause();
    }

    load() {
        this.player.load();
    }

    changeCurrentTime(seconds) {
        return () => {
            const { player } = this.player.getState();
            this.player.seek(player.currentTime + seconds);
        };
    }

    seek(seconds) {
        return () => {
            this.player.seek(seconds);
        };
    }

    changePlaybackRateRate(steps) {
        return () => {
            const { player } = this.player.getState();
            this.player.playbackRate = player.playbackRate + steps;
        };
    }

    changeVolume(steps) {
        return () => {
            const { player } = this.player.getState();
            this.player.volume = player.volume + steps;
        };
    }

    changeSource(name) {
        return () => {
            this.setState({
                source: sources[name]
            });
            this.player.load();
        };
    }

    async init() {
        this.toggleFullscreen();
    }

    async publicationUsers() {
        await axios('publicationUsers')

        await axios({
            method: 'get',
            url: 'publicationUsers'
        }).then(resp => {
            resp.data.map((media, i) => (
                sources.push({
                    id: i,
                    type: media.type,
                    duration: media.duration,
                    src: `${url}/${media.directory}`,
                })));

            this.setState({ sources });
            this.playList();
        })
            .catch(error => {
                console.log(error);
            });
    }

    async playImage(poster, duration) {

        console.log('playImage ' + poster + ' - start');

        return new Promise(result => {
            setTimeout(() => {
                console.log('playImage - stop');
                result(true);
            }, duration * 1000);
        })
    }

    async playVideo(source, duration) {

        console.log('playVideo ' + source + ' - start');

        return new Promise(result => {
            setTimeout(() => {
                console.log('playVideo - stop');
                result(true);
            }, duration * 1000 + 1000);
        })
    }

    async playList() {

        console.log('playList');

        const count = this.state.sources.length;

        if (this.state.index >= count) {
            const { src, duration, type } = this.state.sources[0];
            await this.setState({ index: 1 });

            if (type === 'IMAGE') {
                await this.setState({ poster: src, source: src });
                await this.playImage(src, duration);
                this.playList();
            } else if (type === 'VIDEO') {
                await this.setState({ poster: null, source: src });
                await this.playVideo(src, duration);
                this.playList();
            }
        } else {
            const { src, duration, type } = this.state.sources[this.state.index];
            await this.setState({ index: this.state.index + 1 });
            if (type === 'IMAGE') {
                await this.setState({ poster: src, source: src });
                await this.playImage(src, duration);
                this.playList();
            } else if (type === 'VIDEO') {
                await this.setState({ poster: null, source: src });
                await this.playVideo(src, duration);
                this.playList();
            }
        }
    }

    render() {
        return (
            <div className='p-col-12 p-md-8 center'>
                <div className='player' id='player'>
                    <Player
                        ref={player => {
                            this.player = player;
                        }}
                        muted={true}
                        autoPlay={true}
                        src={this.state.source}
                        poster={this.state.poster}
                    >
                        <ControlBar autoHide={true} disableDefaultControls={true} disableCompletely={true} />
                    </Player>
                </div>
            </div>
        );
    }
}

export default withRouter(Dasboard);