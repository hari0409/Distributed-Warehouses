import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Flex, Heading, Input, Spacer } from "@chakra-ui/react";
import Recomended from "../Components/Recomended/Recomended";

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
