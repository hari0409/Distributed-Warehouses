import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  Text,
  HStack,
  Wrap,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Owned from "../Components/Owned/owned";
import Info from "../Components/Info/Info";
import Rented from "../Components/Rented/Rented";

function DashBoard() {
  const [changed, setChanged] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});

  const [length, setLength] = useState(0);
  const [ownedData, setOwnedData] = useState(null);
  const router = useRouter();

  const getLands = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let ownedIds = await axios.get(
        `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/getAll/${user._id}`
      );
      ownedIds = ownedIds.data;
      let data = ownedIds.map(async (e) => {
        return await axios.get(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/${e}`
        );
      });
      let result = await Promise.all(data);
      let resultData = result.map((e) => e.data);
      setOwnedData(resultData);
      setLength(resultData.length);
    } catch (error) {
      alert("Server unavailable");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedInUser(user);
      getLands();
    } else {
      router.replace("/login");
    }
  }, [changed]);

  return (
    <>
      <Center marginTop="30px">
        <Box>
          <Heading>Dashboard</Heading>
        </Box>
      </Center>
      <Box marginLeft="10px">
        <Box>
          <Info loggedInUser={loggedInUser} />
          <Text fontSize="4xl">Your leased Lands & Warehouses:</Text>
          <Spacer my={2} />
          <HStack>
            <Owned
              ownedData={ownedData}
              changed={changed}
              setChanged={setChanged}
              length={length}
            />
          </HStack>
          <Text fontSize="4xl">Your Rented Spaces</Text>
          <Box>
            <Rented uid={loggedInUser?._id} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default DashBoard;
