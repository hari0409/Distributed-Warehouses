import { Center, Text, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import WarehouseElement from "../WarehouseElement/WarehouseElement";

function Owned({ ownedData, changed, setChanged, length }) {
  return (
    <>
      <Wrap>
        {length != 0 ? (
          <>
            {ownedData.map((e, index) => {
              return (
                <>
                  <WrapItem>
                    <WarehouseElement
                      e={e}
                      status="owned"
                      changed={changed}
                      setChanged={setChanged}
                      key={index}
                    />
                  </WrapItem>
                </>
              );
            })}
          </>
        ) : (
          <>
            <Text fontSize={"xl"} fontWeight="bold" color="#FEB139">
              <Center>NO LAND OR WAREHOUSES</Center>
            </Text>
          </>
        )}
      </Wrap>
    </>
  );
}

export default Owned;
