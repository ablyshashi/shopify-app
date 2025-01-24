/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ConnectAccount from './ConnectAccount';
import { SkeletonDisplayText, SkeletonBodyText } from '@shopify/polaris';

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const shop = queryParams.get('shop');
  const hmac = queryParams.get('hmac');

  console.log({ shop, hmac });



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
    if (window.top === window.self) {      // Not inside an iframe; redirect directly
      window.location.href = url;
    } else {
      // Inside an iframe; redirect the top-level window
      window.top.location.href = `${process.env.REACT_APP_API_URL}/data/shopify?shop=${shop}&hmac=${hmac}`;
    }

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