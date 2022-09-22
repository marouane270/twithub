
import { SessionProvider } from 'next-auth/react';
import { Session } from "next-auth";
import { AppProps } from 'next/app';


function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {

//const App = ({ Component, pageProps }: AppProps) => {
  return (

    <SessionProvider session={pageProps.session}>
      <Component {...pageProps}/>
    </SessionProvider>
  );
};

export default App;