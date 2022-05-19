import { Center, Text } from "@chakra-ui/react";
import React from "react";

function Navigate({ pgNo, setPgNo, length }) {
  return (
    <>
      <Center>
        <GrFormPrevious
          style={{
            margin: "20px",
            background: "red",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          size="1.25em"
          onClick={() => {
            setPgNo(pgNo - 1);
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
            setPgNo(pgNo + 1);
          }}
        />
      </Center>
    </>
  );
}

export default Navigate;
