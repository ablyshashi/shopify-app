import React, { useMemo } from 'react';
import { AppProvider } from '@shopify/polaris';
import { BrowserRouter, Routes, Route } from "react-router";
import ConnectAccount from './ConnectAccount';
// import { AppBridgeContext } from './AppBridgeContext';
// import { createApp } from '@shopify/app-bridge';


const App = () => {
  const apiKey = process.env.REACT_APP_SHOPIFY_API_KEY; // Replace with your Shopify app's API key
  let host = new URLSearchParams(window.location.search).get("host"); // Extract host from the URL

  console.log({ host })


  // if (!host) {

  // }
  host = 'https://admin.shopify.com';
  // const appBridgeConfig = {
  //   apiKey: apiKey,
  //   host: host, // Required for embedded apps
  //   forceRedirect: true, // Redirects to Shopify if not inside an iframe
  // };


  // const appBridge = useMemo(() => {
  //   return createApp({
  //     apiKey: apiKey,
  //     host: host,
  //     forceRedirect: true,
  //   });
  // }, [apiKey, host]);

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ConnectAccount />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>

  );
};
export default App;