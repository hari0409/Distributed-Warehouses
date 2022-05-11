import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Head from "next/head";
import RenteesTable from "../../Components/RenteesTable/RenteesTable";

function Statistics() {
  const [wData, setWData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState(true);

  const router = useRouter();

  const getWareDetails = async (wid) => {
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/${wid}`)
        .then((res) => {
          setWData(res.data);
        })
        .catch((e) => {
          alert(e);
        });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          const wid = router.query.wId;
          getWareDetails(wid);
        } catch (error) {
          alert(error);
        }
      } else {
        router.push("/login");
      }
    }
  }, [router.isReady]);
  return (
    <>
      <Head>
        <title>WaRent</title>
        <meta
          name="description"
          content="Globally Distributed Shared warehouse"
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <TableContainer my={3}>
        <Table variant="striped" colorScheme="purple">
          <Thead>
            <Tr>
              <Th>Statistics on Your Warehouse</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Product Id</Td>
              <Td>{wData?._id}</Td>
            </Tr>
            <Tr>
              <Td>Name</Td>
              <Td>{wData?.name}</Td>
            </Tr>
            <Tr>
              <Td>Address</Td>
              <Td>{wData?.address}</Td>
            </Tr>
            <Tr>
              <Td>Air-Conditioned</Td>
              <Td>{wData?.airConditioner ? "Yes" : "No"}</Td>
            </Tr>
            <Tr>
              <Td>Total Units</Td>
              <Td>{wData?.totalUnits}</Td>
            </Tr>
            <Tr>
              <Td>Available Units</Td>
              <Td>{wData?.availableUnits}</Td>
            </Tr>
            <Tr>
              <Td>Cost Per Ton</Td>
              <Td>{wData?.cost}</Td>
            </Tr>
            <Tr>
              <Td>Description</Td>
              <Td>{wData?.desc}</Td>
            </Tr>
            <Tr>
              <Td>Location Tags</Td>
              <Td>
                {wData?.locationTags.map((e) => {
                  return e.toUpperCase() + " ";
                })}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Box m={3}>
        <Text as="h1" fontSize="xl">
          Renters of this Warehouse
        </Text>
        {wData?.rentees.length == 0 && (
          <Center>
            <Text fontSize="3xl" color="#F8B400" fontWeight="bold">
              NONE
            </Text>
          </Center>
        )}
        {wData?.rentees.length > 0 && (
          <RenteesTable rentees={wData?.rentees} wid={wData?._id} />
        )}
        <Divider
          orientation="horizontal"
          style={{ height: "10px", color: "yellow" }}
        />{" "}
        <Center>
          <VStack>
            <Text fontSize="3xl" color="red">
              Delete your Warehouse
            </Text>
            <Button onClick={onOpen} bg="red" m="2">
              Delete
            </Button>
          </VStack>
        </Center>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Deletion:</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              To confirm your deletion please type "{wData?.name}" in the input
              box
              <Input
                onChange={(e) => {
                  if (e.target.value == wData?.name) {
                    setText(false);
                  }
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                bg={"red"}
                onClick={async () => {
                  try {
                    await axios.post(
                      `${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/delete/${router.query.wId}`
                    );
                    router.replace("/dashboard");
                  } catch (error) {
                    alert(error);
                  }
                }}
                isDisabled={text}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}

export default Statistics;
