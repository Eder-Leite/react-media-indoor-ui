import { render } from 'react-dom';
import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

let resolve;

const defaultProps = {
    title: 'Confirmation?',
    message: 'Do you really want to perform this action?'
};

class Confirm extends Component {

    static create(props = {}) {
        const containerElement = document.createElement('div');
        document.body.appendChild(containerElement);
        return render(<Confirm createConfirmProps={props} />, containerElement);
    }

    constructor() {
        super();

        this.state = {
            isOpen: false,
            showConfirmProps: {},
        };

        this.onHide = this.onHide.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.show = this.show.bind(this);
    }

    onHide() {
        this.setState({ isOpen: false });
        resolve(false);
    }

    onConfirm() {
        this.setState({ isOpen: false });
        resolve(true);
    }

    show(props = {}) {
        const showConfirmProps = { ...this.props.createConfirmProps, ...props };
        this.setState({ isOpen: true, showConfirmProps });
        return new Promise((res) => {
            resolve = res;
        });
    }

    getWidth() {
        if (window.innerWidth > 1024) {
            return 450;
        } else {
            return 350
        }
    }

    render() {
        const { isOpen, showConfirmProps } = this.state;
        const { message, title } = showConfirmProps;
        const footer = (
            <div>
                <Button
                    label='Yes'
                    icon='pi pi-check'
                    onClick={this.onConfirm}
                />
                <Button
                    label='No'
                    icon='pi pi-times'
                    onClick={this.onHide}
                    className='p-button-danger'
                />
            </div>
        );

        return (
            <div className='p-grid p-fluid'>
                <Dialog
                    footer={footer}
                    visible={isOpen}
                    closable={false}
                    onHide={this.onHide}
                    style={{ width: this.getWidth() }}
                    header={title || defaultProps.title}
                >
                    {message || defaultProps.message}
                </Dialog>
            </div>
        );
    }
}

export default Confirm;