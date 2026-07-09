import '../styles/globals.css';
import Footer from '../components/Footer';
import GlobalBackground from '../components/GlobalBackground';

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalBackground />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
