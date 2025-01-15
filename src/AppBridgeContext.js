import { createContext, useContext } from 'react';

export const AppBridgeContext = createContext();

export function useAppBridge() {
    return useContext(AppBridgeContext);
}