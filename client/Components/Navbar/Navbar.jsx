import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import DarkMode from "../DarkMode/DarkMode";
import logo from "../../assets/logo.png";
import { useRouter } from "next/router";

function Navbar() {
  const [userlogged, setUserlogged] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserlogged(user);
    }
  }, [userlogged]);
  const router = useRouter();
  const submitLogout = () => {
    setUserlogged(null);
    localStorage.removeItem("user");
    router.replace("/");
  };

  return (
    <Flex
      position={"relative"}
      p={2}
      display={{ base: "none", md: "flex" }}
      justifyContent="space-between"
      alignItems="center"
      bgColor="#30AADD"
    >
      <Flex color="white">
        <Center w="125px">
          <Image src={logo} width="100%" height="100%" />
          <Box>
            <Text fontSize="lg">
              <Link
                textDecoration="none!Important"
                href={userlogged ? "/dashboard" : "/"}
              >
                WaRent
              </Link>
            </Text>
          </Box>
        </Center>
      </Flex>

      <Box mr={"3rem"}>
        <ButtonGroup m={2}>
          <Link href="/declare">
            <Button backgroundColor="#FFAB76">Lease a Land</Button>
          </Link>
          <Link href="/rentnow">
            <Button backgroundColor="#FFAB76">Rent Your Space</Button>
          </Link>
          {userlogged ? (
            <>
              <Link href="/dashboard">
                <Button backgroundColor="#FFAB76">Dashboard</Button>
              </Link>{" "}
              <Button backgroundColor="#FFAB76" onClick={submitLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button backgroundColor="#FFAB76">Login</Button>
              </Link>
              <Link href="/signup">
                <Button backgroundColor="#FFAB76">SignUp</Button>
              </Link>
            </>
          )}
          <DarkMode />
        </ButtonGroup>
      </Box>
    </Flex>
  );
}

export default Navbar;
