import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  HStack,
  Thead,
  Text,
  Tr,
  Center,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import next from "next";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

function Rented({ uid }) {
  const [rented, setRented] = useState([]);
  const [names, setNames] = useState([]);
  const [pgNo, setPgNo] = useState(1);
  const [length, setLength] = useState(1);
  const [changed, setChanged] = useState(false);
  const [total, setTotal] = useState([]);
  const [selected, setSelected] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const limit = 5;
  const headers = [
    {
      label: "Id",
      key: "_id",
    },
    {
      label: "Date of Allocation",
      key: "createdAt",
    },
    {
      label: "Land Id",
      key: "lid",
    },
    {
      label: "Warehouse Name",
      key: "name",
    },
    {
      label: "Quantity",
      key: "quantity",
    },
  ];

  const getAll = async () => {
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/rentedall/${uid}`)
        .then((res) => {
          setTotal(res.data);
          console.log(res.data);
        })
        .catch((e) => {
          alert(e);
        });
    } catch (error) {
      next(error);
    }
  };

  const getRented = async () => {
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/rentedlength/${uid}`)
        .then((res) => {
          if (res.data[0].length) {
            setLength(Math.ceil(res?.data[0]?.length / limit));
          }
          console.log(res.data[0].length);
        })
        .catch(() => {
          setLength(1);
        });
      const body = {
        uid: uid,
        pgNo: pgNo,
        limit: limit,
      };
      await axios
        .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/getRented`, body)
        .then((res) => {
          res.data.sort((a, b) => {
            let keyA = new Date(a.createdAt);
            let keyB = new Date(b.createdAt);
            return keyA > keyB ? -1 : keyA < keyB ? 1 : 0;
          });
          setRented(res.data);
        });
    } catch (error) {
      alert(error + " from rented");
    }
  };

  const getNames = async () => {
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
    const body = {
      userId: user?._id,
      landId: renter?.lid,
      quan: renter?.quantity,
      cid: renter?.cid,
    };
    await axios
      .put(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/exit`, body)
      .then(() => {
        alert("Successfully exited");
        setChanged(!changed);
        setSelected(null);
        onClose();
      })
      .catch((e) => {
        alert(e);
      });
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      if (uid) {
        getRented();
        getNames(rented);
      }
    }
  }, [uid, pgNo, changed]);

  return (
    <>
      {names && (
        <>
          <Center>
            <HStack>
              <GrFormPrevious
                style={{
                  margin: "20px",
                  background: "red",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                size="1.25em"
                onClick={() => {
                  if (pgNo > 1) {
                    setPgNo(pgNo - 1);
                  }
                }}
              />
              <Text>
                {pgNo}/{length}
              </Text>
              <GrFormNext
                style={{
                  margin: "20px",
                  background: "red",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                size="1.25em"
                onClick={() => {
                  if (pgNo < length) {
                    setPgNo(pgNo + 1);
                  }
                }}
              />
              {total?.length ? (
                <Button background="#541690">
                  <CSVLink
                    data={total}
                    headers={headers}
                    filename={`Rented-${uid}-${Date.now()}.csv`}
                  >
                    Download as CSV
                  </CSVLink>
                </Button>
              ) : (
                <>
                  <Button background="#541690" onClick={getAll}>
                    Export as CSV
                  </Button>
                </>
              )}
            </HStack>
          </Center>
          <TableContainer>
            <Table variant={"striped"}>
              <Thead>
                <Tr>
                  <Th>Allocation Id</Th>
                  <Th>Date</Th>
                  <Th>Warehouse Id</Th>
                  <Th>Warehouse Name</Th>
                  <Th>Quantity</Th>
                  <Th>Exit</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.values(rented).map((r, index) => {
                  let d = new Date(r?.createdAt);
                  d = d.toDateString();
                  return (
                    <Tr key={r?._id}>
                      <Td>{r?.cid}</Td>
                      <Td>{d}</Td>
                      <Td>{r?.lid}</Td>
                      <Td>{r?.name}</Td>
                      <Td>{r?.quantity}</Td>
                      <Td>
                        <Button
                          bg="red"
                          onClick={() => {
                            onOpen();
                            setSelected(r);
                          }}
                        >
                          Exit
                        </Button>
                        <Modal isOpen={isOpen} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Modal Title</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>Are you sure that you want to exit this warehouse? </ModalBody>
                            <ModalFooter>
                              <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={onClose}
                              >
                                Close
                              </Button>
                              <Button
                                onClick={(e) => {
                                  exitWare(e, selected);
                                }}
                                background="red"
                              >
                                Delete
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
        </>
      )}
      {!names && length == 0 && (
        <Center my={5}>
          <Text>You have no rented lands</Text>
        </Center>
      )}
    </>
  );
}

export default Rented;
