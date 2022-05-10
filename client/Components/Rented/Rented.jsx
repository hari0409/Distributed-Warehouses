import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Rented({ uid }) {
  const [rented, setRented] = useState([]);
  const [names, setNames] = useState([]);
  const router=useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getRented = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/getRented/${uid}`)
      .then((res) => {
        setRented(res.data);
      });
  };

  const getNames = async () => {
    console.log(rented);
    let data = rented.map(async (r) => {
      return await axios.get(
        `${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/getname/${r?.lid}`
      );
    });
    let result = await Promise.all(data);
    let resultData = result.map((e) => e.data);
    setNames(resultData);
  };

  const exitWare = async (e, renter) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(renter);
    const body = {
      userId: user?._id,
      landId: renter?.lid,
      quan: renter?.quantity,
      cid: renter?.cid,
    };
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/exit`,
        body
      )
      .then((res) => {
        alert(res.data);
        router.reload();
      })
      .catch((e) => {
        alert(e);
      });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (uid) {
        getRented();
        getNames(rented);
      }
    }
  }, [uid]);

  return (
    <>
      {names && (
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Allocation Id</Th>
                <Th>Warehouse Id</Th>
                <Th>Warehouse Name</Th>
                <Th>Quantity</Th>
                <Th>Exit</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.values(rented).map((r, index) => {
                return (
                  <Tr key={r?._id}>
                    <Td>{r?.cid}</Td>
                    <Td>{r?.lid}</Td>
                    <Td>{r?.name}</Td>
                    <Td>{r?.quantity}</Td>
                    <Td>
                      <Button bg="red" onClick={onOpen}>
                        Exit
                      </Button>
                      <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Exit Warehouse:</ModalHeader>
                          <ModalBody>
                            Are you sure you want to exit from this warehouse
                            completely?
                          </ModalBody>
                          <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                              Close
                            </Button>
                            <Button
                              bg={"red"}
                              onClick={(e) => {
                                exitWare(e, r);
                              }}
                            >
                              Remove
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default Rented;
