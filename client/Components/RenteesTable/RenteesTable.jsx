import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MdOutlinePersonRemove } from "react-icons/md";

function RenteesTable({ rentees, wid }) {
  const [names, setNames] = useState([]);

  const router = useRouter();

  const getName = async (rentees) => {
    let data = rentees.map(async (r) => {
      return await axios.get(
        `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/getname/${r?.rid}`
      );
    });
    let result = await Promise.all(data);
    let resultData = result.map((e) => e.data);
    setNames(resultData);
  };

  const deleteHandle = async (e, renter) => {
    e.preventDefault();
    const body = {
      warehouseId: wid,
      renterId: renter?.rid,
      quantity: renter?.quantity,
      cid: renter?.cid,
    };
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/kickout`,
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
    const arRentees = new Array();
    for (let i = 0; i < rentees.length; i++) {
      arRentees.push(rentees[i]);
    }
    getName(arRentees);
  }, []);

  return (
    <>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Allocation Id</Th>
              <Th>Renter Id</Th>
              <Th>Renter Name</Th>
              <Th>Quantity</Th>
              <Th>Remove</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.values(rentees).map((r, index) => {
              return (
                <Tr>
                  <Td>{r.cid}</Td>
                  <Td>{r.rid}</Td>
                  <Td>{names[index]}</Td>
                  <Td>{r.quantity}</Td>
                  <Td>
                    <Button bg="red" onClick={(e)=>{
                      deleteHandle(e,r);
                    }}>
                      <MdOutlinePersonRemove />
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default RenteesTable;
