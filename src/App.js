/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ConnectAccount from './ConnectAccount';
import { SkeletonDisplayText, SkeletonBodyText, AppProvider } from '@shopify/polaris';
import en from "@shopify/polaris/locales/en.json";
import { useAppBridge } from '@shopify/app-bridge-react';
import { createApp } from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { LoadingSkeleton } from './ConnectAccount';
import "@shopify/polaris/build/esm/styles.css";

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const shop = queryParams.get('shop');
  const hmac = queryParams.get('hmac');
  const embedded = queryParams.get('embedded');

  // const shopifyAppBridge = useAppBridge();
  // //const user =  await aa.user()

  // console.log({ shop, hmac, dddd: 2 });



  const [showConnectComponent, setShowConnectComponent] = useState(false);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {

    if (!shop) {
      return;
    }

    if (!embedded) {
      window.location.href = `${process.env.REACT_APP_API_URL}data/shopify?shop=${shop}&hmac=${hmac}`;
      return
    }
    const isInstalled = () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('shop', shop);

      fetch(`${process.env.REACT_APP_API_URL}data/is-shopify-installed`, {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status == 1) {
            setShowConnectComponent(true)
          } else {
            const client = createApp({
              apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
              host: new URLSearchParams(location.search).get("host"),
              forceRedirect: false,
            });
            const redirect = Redirect.create(client);
            redirect.dispatch(Redirect.Action.REMOTE, `${process.env.REACT_APP_API_URL}/data/shopify?shop=${shop}&hmac=${hmac}`);
          }

        }).finally(() => {
          setIsLoading(false);
        });;
    };

    isInstalled();

    return () => {
      const existingScript = document.querySelector('script[src="https://cdn.shopify.com/shopifycloud/app-bridge.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      const existingMeta = document.querySelector('meta[name="shopify-api-key"]');
      if (existingMeta) {
        document.head.removeChild(existingMeta);
      }
    };

  }, [shop, hmac]);


  return (
    <AppProvider i18n={en}>
      {loading && <LoadingSkeleton />}
      {showConnectComponent && <ConnectAccount />}
    </AppProvider>

  );
};

export default App;