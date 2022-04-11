import { Text, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import WarehouseElement from "../WarehouseElement/WarehouseElement";

function Owned({ ownedData, changed, setChanged, length }) {
  return (
    <>
      <Wrap>
        {length != 0 ? (
          <>
            {ownedData.map((e) => {
              return (
                <>
                  <WrapItem>
                    <WarehouseElement
                      e={e}
                      status="owned"
                      changed={changed}
                      setChanged={setChanged}
                    />
                  </WrapItem>
                </>
              );
            })}
          </>
        ) : (
          <>
            <Text>No Land Or Warehouse</Text>
          </>
        )}
      </Wrap>
    </>
  );
}

export default Owned;
