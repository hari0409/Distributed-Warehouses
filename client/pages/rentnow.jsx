import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Flex, Input } from "@chakra-ui/react";
import Recomended from "../Components/Recomended/Recomended";
import Head from "next/head";


function RentNow() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedInUser(user);
    } else {
      router.replace("/login");
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchQuery(router.query.searchQuery);
    router.push("/searchResult?searchQuery=" + searchQuery);
  };

  return (
    <>
      <Flex m={5}>
        <Head>
          <title>WaRent</title>
          <meta
            name="description"
            content="Globally Distributed Shared warehouse"
          />
          <link rel="icon" href="/logo.ico" />
        </Head>
        <Input
          placeholder="Search based on location..."
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          width={["100%", "75%", "50%"]}
          mx={2}
        />
        <Button onClick={handleSearch} bg="teal">
          Search
        </Button>
      </Flex>
      <Flex m={5}>
        <Recomended />
      </Flex>
    </>
  );
}

export default RentNow;
