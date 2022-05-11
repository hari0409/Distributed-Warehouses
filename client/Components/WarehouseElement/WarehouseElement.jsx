import {
  Badge,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";

function WarehouseElement({ e, status, changed, setChanged }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <>
      <Box w="350px" rounded="20px" overflow="hidden" border="2px solid green">
        <Box p={5}>
          <Stack align="center">
            <Badge variant="solid" colorScheme="green" rounded="full" px={2}>
              {e.name}
            </Badge>
          </Stack>
          <Stack align="center">
            <Text as="h2" fontWeight="normal" mt={2}>
              Total: {e.totalUnits} Available: {e.availableUnits}
            </Text>
            <Text as="h2" fontWeight="normal" mt={2}>
              Cost per Ton: ₹{e.cost}
            </Text>
            {status === "owned" ? (
              <Text as="h2" fontWeight="normal" mt={2}>
                Revenue: ₹{e.cost * (e.totalUnits - e.availableUnits)}
              </Text>
            ) : null}
            <Text fontWeight="light">Address: {e.address}</Text>
            <Text fontWeight="light">Product Id: {e._id}</Text>
          </Stack>
          {status === "owned" ? (
            <>
              <Flex my={2} justifyContent="center">
                <Button
                  bg={"#9FB4FF"}
                  m="2"
                  onClick={() => {
                    router.push(`/edit/${e._id}`);
                  }}
                >
                  Edit
                </Button>
                <Button
                  bg={"#E15FED"}
                  m="2"
                  onClick={() => {
                    router.push({
                      pathname: `/statistics/${e._id}`
                    });
                  }}
                >
                  Stats
                </Button>
              </Flex>
            </>
          ) : (
            <>
              <Flex my={2} justifyContent="center">
                <Button
                  color={"green"}
                  bg="blue.200"
                  onClick={() => {
                    router.push(`/rentIt/${e._id}`);
                  }}
                >
                  Rent It
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}

export default WarehouseElement;
