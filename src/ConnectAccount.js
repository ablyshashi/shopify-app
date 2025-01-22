import { Link, AccountConnection } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
// import { useAppBridge } from '@shopify/app-bridge-react';


function ConnectAccount() {
    const [connected, setConnected] = useState(false);
    const [accountName, setAccountName] = useState('');

    // const appBridge = useAppBridge();


    // console.log({ appBridge });



    const queryParams = new URLSearchParams(window.location.search);
    const shop = queryParams.get('shop');
    const hmac = queryParams.get('hmac');

    console.log({ shop });

    const connectShopify = useCallback(() => {
        // Redirect to the Shopify Connect page

    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/data/check-shopify-connection?shop=${shop}`)
            .then((response) => response.json())
            .then((data) => {
                setConnected(data.status === 1);
                setAccountName(data.userName);
            });
    }, [shop, hmac]);

    const disconnectShopify = useCallback(() => {
        // Redirect to the Shopify Connect page
        fetch(`${process.env.REACT_APP_API_URL}/data/disconnect-shopify-account?shop=${shop}`, {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 1) {
                    setConnected(false);
                    setAccountName('');
                }
            });
    }, [shop]);

    const handleAction = useCallback(() => {
        if (connected) {
            // Disconnect the account
            disconnectShopify();
        } else {
            connectShopify();
        }
    }, [connectShopify, connected, disconnectShopify]);

    const buttonText = connected ? 'Disconnect' : 'Connect';
    const details = connected ? 'Account connected' : 'No account connected';
    const terms = connected ? null : (
        <p>
            By clicking <strong>Connect</strong>, you agree to accept Sample App's{' '}
            <Link url="Example App">terms and conditions</Link>. You'll pay a
            commission rate of 15% on sales made through Sample App.
        </p>
    );

    return (
        <AccountConnection
            accountName={accountName}
            connected={connected}
            title="Shopify App"
            action={{
                content: buttonText,
                onAction: handleAction,
            }}
            details={details}
            termsOfService={terms}
        />
    );
}
export default ConnectAccount;