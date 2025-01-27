import { Link, AccountConnection, SkeletonDisplayText, SkeletonBodyText } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';


export const LoadingSkeleton = () => (
    <div style={{ padding: '1rem' }}>
        <SkeletonDisplayText size="small" />
        <div style={{ marginTop: '1rem' }}>
            <SkeletonBodyText lines={2} />
        </div>
    </div>
);


function ConnectAccount() {
    const [connected, setConnected] = useState(false);
    const [accountName, setAccountName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const nelsonUrl = process.env.REACT_APP_API_URL;

    const queryParams = new URLSearchParams(window.location.search);
    const shopUrl = queryParams.get('shop');

    const checkIfConnected = useCallback(async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('shop', shopUrl);

        fetch(`${nelsonUrl}data/check-shopify-connection`, {
            method: "POST",
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                setConnected(data.status === 1);
                setAccountName(data?.userName ?? '');
            }).finally(() => {
                setIsLoading(false);
            });;
    }, [nelsonUrl, shopUrl]);

    useEffect(() => {
        checkIfConnected();
    }, [checkIfConnected]);

    const disconnectShopify = useCallback(() => {
        setIsDisconnecting(true);
        const formData = new FormData();
        formData.append('shop', shopUrl);
        // Redirect to the Shopify Connect page
        fetch(`${nelsonUrl}data/disconnect-shopify-account`, {
            method: "POST",
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 1) {
                    setConnected(false);
                    setAccountName('');
                }
            }).finally(() => {
                setIsDisconnecting(false);
            });;
    }, [nelsonUrl, shopUrl]);


    const connectShopify = useCallback(() => {

        const width = 600; // Desired width of the new window
        const height = 400; // Desired height of the new window    
        // Calculate the position to center the window on the screen
        const left = window.screen.width + (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const features = [
            `width=${width}`,
            `height=${height}`,
            `top=${top}`,
            `left=${left}`,
            'resizable=no',
            'scrollbars=no',
            'menubar=no',
            'toolbar=no',
            'location=no',
            // Attempts to hide the location bar, but it may still appear
        ].join(',');

        const popup = window.open(
            `${nelsonUrl}guest-user/login-shopify-form`,
            'Popup',
            features
        );

        // Handle the response from popup
        window.addEventListener('message', (event) => {
            if (event.origin === nelsonUrl) {
                popup.close();
                checkIfConnected();
            }
        });

    }, [checkIfConnected, nelsonUrl]);
    const buttonText = connected ? 'Disconnect' : 'Connect';
    const details = connected ? 'Account connected' : 'No account connected';
    const terms = connected ? <p>
        Now you can sync your orders and products in <Link url="https://www.upcoming.store/guest-user/login-form">Upcoming store</Link>
    </p> : (
        <p>
            By clicking <strong>Connect</strong>, you agree to accept Upcoming App's{' '}
            <Link url="https://www.upcoming.store/terms-of-use">terms and conditions</Link>. You must have an seller account to use this <Link url="https://www.upcoming.store/">Upcoming store</Link>.
        </p>
    );



    return (
        <>
            {isLoading ? (
                <LoadingSkeleton />
            ) : (
                <AccountConnection
                    accountName={accountName}
                    connected={connected}
                    title="Upcoming App"
                    action={{
                        content: buttonText,
                        onAction: connected ? disconnectShopify : connectShopify,
                        loading: isDisconnecting,
                        disabled: isDisconnecting
                    }}
                    details={details}
                    termsOfService={terms}
                />
            )}
        </>
    );
}
export default ConnectAccount;