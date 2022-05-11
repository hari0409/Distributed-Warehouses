import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

function Info({loggedInUser}) {
  return (
    <>
      <Flex justifyContent="start">
        <Box>
          <Text fontSize="3xl">Welcome {loggedInUser.name}</Text>
        </Box>
      </Flex>
    </>
  );
}

export default Info;
