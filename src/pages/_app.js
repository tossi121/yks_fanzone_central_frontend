import '@/styles/common/_app.scss';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const DashboardLayout = dynamic(import('@/components/Layouts'));

const layouts = {
  DashboardLayout: DashboardLayout,
  NoLayout: '',
};

function App({ Component, pageProps }) {
  const Layout = layouts[Component.layout] || ((pageProps) => <Component>{pageProps}</Component>);

  return (
    <>
      <Head>
        <title>YKS Fanzone Central</title>
        <meta name="description" content="YKS Fanzone Central" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default App;
