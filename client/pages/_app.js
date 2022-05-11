import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";
import theme from "../lib/themes";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
