import { ChakraProvider } from "@chakra-ui/react";
import Footer from "../Components/Footer/Footer";
import Navbar from "../Components/Navbar/Navbar";
import theme from "../lib/themes";

function MyApp({ Component, pageProps }) {
  return (
      <ChakraProvider theme={theme}>
        <Navbar />
        <Component {...pageProps} />
        <Footer/>
      </ChakraProvider>
  );
}

export default MyApp;
