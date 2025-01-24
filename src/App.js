/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ConnectAccount from './ConnectAccount';
import { SkeletonDisplayText, SkeletonBodyText } from '@shopify/polaris';
import { getSessionToken } from '@shopify/app-bridge-utils';

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const shop = queryParams.get('shop');
  const hmac = queryParams.get('hmac');

  console.log({ shop, hmac });

  const appBridgeConfig = {
    apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
    shopOrigin: shop,
  };

  console.log(getSessionToken);


  const [showConnectComponent, setShowConnectComponent] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const LoadingSkeleton = () => (
    <div style={{ padding: '1rem' }}>
      <SkeletonDisplayText size="small" />
      <div style={{ marginTop: '1rem' }}>
        <SkeletonBodyText lines={2} />
      </div>
    </div>
  );

  useEffect(() => {
    const redirectUserToNelson = () => {
      window.location.href = `${process.env.REACT_APP_API_URL}/data/shopify?shop=${shop}&hmac=${hmac}`;
    };

    getSessionToken(appBridgeConfig)
      .then((token) => {
        console.log('Session token:', token);
        // Send the token to your backend for validation
        console.log('Session token:', token);
      })
      .catch((error) => {
        redirectUserToNelson();
        console.error('Failed to get session token:', error);

      });

    const isInstalled = () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('shop', shop);

      console.log("isInstalled");

      fetch(`${process.env.REACT_APP_API_URL}data/check-shopify-connection`, {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 1) {
            setShowConnectComponent(true)
          } else {
            // redirectUserToNelson();
          }

        }).finally(() => {
          setIsLoading(false);
        });;
    };

    if (shop) {

      // isInstalled();
    }

  }, [shop, hmac]);

  return (
    <>
      {loading && <LoadingSkeleton />}
      {showConnectComponent && <ConnectAccount />}
      <p>sfsafasfsaf</p>
    </>

  );
};

export default App;