import Toasty from '../components/toasty';

const ErrorHandler = (props, errorResponse) => {
    let msg = '';

    if (typeof errorResponse === 'string') {
        msg = errorResponse;
        console.log(msg);

    } else if (errorResponse.request.status >= 400 && errorResponse.request.status <= 499) {
        msg = 'There was an error processing your request!';

        if (errorResponse.request.status === 400) {
            msg = 'Attention invalid email or password!';
        }

        if (errorResponse.request.status === 401) {
            msg = 'Your session has expired, re-login again!';

            props.history.push({ pathname: '/' });
        }

        if (errorResponse.request.status === 403) {
            msg = 'You are not allowed to perform this action!';
        }

        if (errorResponse.request.status === 404) {
            try {
                const { response } = errorResponse.request;
                const { message } = JSON.parse(response);

                if (message) {
                    msg = message;
                }

            } catch (error) {
                console.log(error);
            }
        }

    } else {
        msg = 'Error processing remote service. Try again!';
    }

    Toasty.error('Error', msg);

    return true;
}

export default ErrorHandler;