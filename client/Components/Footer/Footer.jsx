import { Box, Text } from "@chakra-ui/react";
import React from "react";
import logo from "../../assets/logo.png";
import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image src={logo} width="100%" height="100%" />
      <Box>
        <Text fontSize="lg">WaRent</Text>
      </Box>
    </>
  );
};

function Footer() {
  return <></>;
}

export default Footer;
