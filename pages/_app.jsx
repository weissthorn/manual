import '../styles/app.scss';

import { GeistProvider, CssBaseline } from '@geist-ui/core';

const App = ({ Component, pageProps }) => {
  return (
    <GeistProvider themeType="light">
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
