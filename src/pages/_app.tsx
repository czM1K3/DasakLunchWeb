import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import "simpledotcss/simple.min.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextNProgress color="#ffb700" />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;
