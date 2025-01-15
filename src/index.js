import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppProvider } from '@shopify/app-bridge-react';
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
const container = document.getElementById("root");
const root = createRoot(container);


const config = {
  apiKey: process.env.REACT_APP_SHOPIFY_API_KEY, // From your .env file
  host: new URLSearchParams(window.location.search).get('host'), // Get host from query params
  forceRedirect: true,
};

root.render(
  <AppProvider config={config}>
    <App />
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
