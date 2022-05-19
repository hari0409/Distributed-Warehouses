import axios from "axios";
import {
  Button,
  Center,
  HStack,
  Select,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

function Orders({ id }) {
  const [pgNo, setPgNo] = useState(1);
  const limit = 5;
  const [orders, setOrders] = useState([]);
  const [length, setLength] = useState(1);

  const getOrders = async () => {
    if (id) {
      try {
        await axios
          .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/orderlength/${id}`)
          .then((res) => {
            if (res.data[0].length) {
              setLength(Math.ceil(res.data[0].length / limit));
            }
          })
          .catch((e) => {
            setLength(1);
          });
        const body = {
          id: id,
          pgNo: pgNo,
          limit: limit,
        };
        await axios
          .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/getOrders`, body)
          .then((res) => {
            res.data.orders.sort((a, b) => {
              let keyA = new Date(a.createdAt);
              let keyB = new Date(b.createdAt);
              return keyA > keyB ? -1 : keyA < keyB ? 1 : 0;
            });
            setOrders(res.data.orders);
          })
          .catch((e) => {
            alert(e);
          });
      } catch (error) {
        alert(error + " from orders");
      }
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      getOrders();
    }
  }, [pgNo, id]);

  return (
    <>
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
          </HStack>
        </Center>
        <TableContainer>
          <Table variant={"striped"}>
            <Thead>
              <Tr>
                <Th>Payment Id</Th>
                <Th>Date</Th>
                <Th>Warehouse Name</Th>
                <Th>Amount</Th>
                <Th>Quantity</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.length > 0 &&
                orders.map((o) => {
                  let d = new Date(o.createdAt);
                  d = d.toDateString();
                  return (
                    <>
                      <Tr key={o?.paymentId}>
                        <Td>{o?.paymentId}</Td>
                        <Td>{d}</Td>
                        <Td>{o?.lid}</Td>
                        <Td>{o?.amount}</Td>
                        <Td>{o?.quantity}</Td>
                      </Tr>
                    </>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      </>
      {orders.length == 0 && length == 0 && (
        <Center my={5}>
          <Text>You have no Orders</Text>
        </Center>
      )}
    </>
  );
}

export default Orders;
