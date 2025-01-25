/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ConnectAccount from './ConnectAccount';
import { SkeletonDisplayText, SkeletonBodyText, AppProvider } from '@shopify/polaris';
import en from "@shopify/polaris/locales/en.json";
import {useAppBridge} from '@shopify/app-bridge-react';

const App = () =>  {
  const queryParams = new URLSearchParams(window.location.search);
  const shop = queryParams.get('shop');
  const hmac = queryParams.get('hmac');

  const shopifyAppBridge = useAppBridge();
  //const user =  await aa.user()

  console.log({ shop, hmac,dddd: 2 });



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



  useEffect(async() => {
    const user = await shopifyAppBridge.user();
    console.log({user});
    const isInstalled = () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('shop', shop);

      console.log("isInstalled");

      fetch(`${process.env.REACT_APP_API_URL}data/is-shopify-installed`, {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 1) {
            setShowConnectComponent(true)
          } else {
            window.location.href = `${process.env.REACT_APP_API_URL}/data/shopify?shop=${shop}&hmac=${hmac}`;
          }

        }).finally(() => {
          setIsLoading(false);
        });;
    };

    isInstalled();

  }, [shop, hmac]);

  return (
    <AppProvider i18n={en}>
      {loading && <LoadingSkeleton />}
      {showConnectComponent && <ConnectAccount />}
      <p>sfsafasfsaf</p>
    </AppProvider>

  );
};

export default App;