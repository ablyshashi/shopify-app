import React, { useEffect, useState } from 'react';
import { AppProvider } from '@shopify/polaris';
import ConnectAccount from './ConnectAccount';
import en from "@shopify/polaris/locales/en.json";

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const shop = queryParams.get('shop');
  const hmac = queryParams.get('hmac');

  const [showConnectComponent] = useState(false);

  useEffect(() => {
    const redirectUserToNelson = () => {
      window.location.href = `${process.env.REACT_APP_API_URL}/data/shopify?shop=${shop}&hmac=${hmac}`;
    };

    if (hmac) {
      redirectUserToNelson();
    }
  }, [shop, hmac]);

  return (
    <AppProvider i18n={en}>
      {showConnectComponent && <ConnectAccount />}
    </AppProvider>
  );
}; export default App;