import React, { useEffect, useState } from 'react';
import { AppProvider } from '@shopify/polaris';
import ConnectAccount from './ConnectAccount';
import en from "@shopify/polaris/locales/en.json";
import { SkeletonDisplayText, SkeletonBodyText } from '@shopify/polaris';

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const shop = queryParams.get('shop');
  const hmac = queryParams.get('hmac');

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

    const isInstalled = () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('shop', shop);

      fetch(`${process.env.REACT_APP_API_URL}data/check-shopify-connection`, {
        method: "POST",
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 1) {
            setShowConnectComponent(true)
          } else {
            redirectUserToNelson();
          }

        }).finally(() => {
          setIsLoading(false);
        });;
    };

    if (hmac) {
      redirectUserToNelson();
    } else {
      isInstalled();

    }

  }, [shop, hmac]);

  return (
    <AppProvider i18n={en}>
      {loading && <LoadingSkeleton />}
      {showConnectComponent && <ConnectAccount />}
    </AppProvider>
  );
}; export default App;