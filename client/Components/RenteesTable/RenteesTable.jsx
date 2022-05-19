import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Center,
  HStack,
  Text,
} from "@chakra-ui/react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdOutlinePersonRemove } from "react-icons/md";
import { CSVLink } from "react-csv";

function RenteesTable({ wid }) {
  const [total, setTotal] = useState([]);
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pgNo, setPgNo] = useState(1);
  const limit = 5;
  const [length, setLength] = useState(1);
  const [changed, setChanged] = useState(false);
  const [existingRentees, setExistingRentees] = useState([]);

  const headers = [
    {
      label: "Id",
      key: "_id",
    },
    {
      label: "Allocation Id",
      key: "cid",
    },
    {
      label: "Customer Id",
      key: "cid",
    },
    {
      label: "Quantity",
      key: "quantity",
    },
  ];

  const deleteHandle = async (e, renter) => {
    e.preventDefault();
    const body = {
      warehouseId: wid,
      renterId: renter?.rid,
      quantity: renter?.quantity,
      cid: renter?.cid,
    };
    await axios
      .put(`${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/kickout`, body)
      .then((res) => {
        alert(res.data);
        setSelected(null);
        setChanged(!changed);
      })
      .catch((e) => {
        alert(e);
      });
  };

  const getRentees = async () => {
    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/renteeslength/${wid}`
        )
        .then((res) => {
          if (res.data[0].length) {
            setLength(Math.ceil(res.data[0].length / limit));
          }
        })
        .catch((e) => {
          setLength(1);
        });
      const body = {
        id: wid,
        pgNo: pgNo,
        limit: limit,
      };
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/getrentees`,
          body
        )
        .then((res) => {
          setExistingRentees(res.data);
        });
    } catch (error) {
      alert(error);
    }
  };

  const getAll = async () => {
    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/allrentees/${wid}`
        )
        .then((res) => {
          setTotal(res.data);
          console.log(res.data);
        })
        .catch((e) => {
          alert(e);
        });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getRentees();
  }, [changed, pgNo]);

  return (
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
                filename={`Rented-${wid}-${Date.now()}.csv`}
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
        <Table>
          <Thead>
            <Tr>
              <Th>Allocation Id</Th>
              <Th>Renter Id</Th>
              <Th>Quantity</Th>
              <Th>Remove</Th>
            </Tr>
          </Thead>
          <Tbody>
            {existingRentees.map((renter, index) => {
              return (
                <>
                  <Tr key={index}>
                    <Td>{renter?.cid}</Td>
                    <Td>{renter?.rid}</Td>
                    <Td>{renter?.quantity}</Td>
                    <Td>
                      <Button
                        bg="red"
                        onClick={() => {
                          onOpen();
                          setSelected(renter);
                        }}
                      >
                        <MdOutlinePersonRemove />
                      </Button>
                      <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Modal Title</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>Hello </ModalBody>
                          <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                              Close
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={(e) => {
                                deleteHandle(e, selected);
                                onClose();
                              }}
                            >
                              Remove
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </Td>
                  </Tr>
                </>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default RenteesTable;
