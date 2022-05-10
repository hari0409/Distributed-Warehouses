import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Center,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import RenteesTable from "../../Components/RenteesTable/RenteesTable";

function Statistics() {
  const [wData, setWData] = useState(null);

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
      </Box>
    </>
  );
}

export default Statistics;
