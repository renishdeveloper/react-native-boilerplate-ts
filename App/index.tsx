import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { ToastProvider } from 'react-native-styled-toast';
import axios from 'axios';
import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';
import { store, persistor } from '@Stores/index';
import { ApiConfig } from '@ApiConfig/index';
import { getItemFromStorage } from '@Utils/Storage';
import { configureUrl } from '@Utils/Helper';
import { AppContext, AppContextProvider } from '@AppContext/index';
import { NoConnection } from '@SubComponents/index';
import CommonStyle from '@Theme/CommonStyle';
import Routes from '@Routes/index';

axios.interceptors.request.use(
  async config => {
    let request = config;
    let token: string | null = ApiConfig.token;
    if (!token) {
      token = await getItemFromStorage('token');
    }
    request.headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    request.url = configureUrl(config.url!);
    return request;
  },
  error => error,
);

const App = () => {
  const [isConnected, setIsConnected] = useState(true);

  const { appTheme } = useContext(AppContext);

  useEffect(() => {
    let netInfoSubscription: NetInfoSubscription | null = null;
    const manageConnection = () => {
      retryConnection();
      netInfoSubscription = NetInfo.addEventListener(handleConnectivityChange);
    };
    // Check network connection
    const retryConnection = async () => {
      handleConnectivityChange(await NetInfo.fetch());
    };
    manageConnection();
    return () => {
      if (netInfoSubscription) {
        netInfoSubscription();
      }
    };
  }, []);

  const retryConnection = async () => {
    handleConnectivityChange(await NetInfo.fetch());
  };

  // Managed internet connection
  const handleConnectivityChange = (info: NetInfoState) => {
    if (info.type === 'none' || !info.isConnected) {
      setIsConnected(false);
    } else {
      setIsConnected(true);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContextProvider>
          <ThemeProvider theme={{ appTheme }}>
            <ToastProvider maxToasts={2} offset={0} position="BOTTOM">
              <View style={CommonStyle.flexContainer}>
                <Routes />
                {(!isConnected && (
                  <NoConnection retryConnection={retryConnection} />
                )) ||
                  null}
              </View>
            </ToastProvider>
          </ThemeProvider>
        </AppContextProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
