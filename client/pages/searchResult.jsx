import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react";
import WarehouseElement from "../Components/WarehouseElement/WarehouseElement";

function SearchResult() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState("");

  const getResult = async () => {
    try {
      const val = router.query.searchQuery;
      setSearch(val);
      const data = {
        locations: [val],
      };
      console.log(data);
      await axios
        .patch(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/locations`,
          data
        )
        .then((res) => {
          console.log(res.data);
          setResults(res.data);
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
      getResult();
    }
  }, [router.isReady]);
  return (
    <>
      <Flex justifyContent="start" marginLeft="10px">
        <Box>
          <Text fontSize="2xl" m={5}>
            Search Result for {search}
          </Text>
          <Spacer my={2} />
          <HStack m={5}>
            {results ? (
              results.map((e) => {
                return (
                  <>
                    <WarehouseElement e={e} status="recomended" key={e._id} />
                  </>
                );
              })
            ) : (
              <Text>No Land Or Warehouse</Text>
            )}
          </HStack>
        </Box>
      </Flex>
    </>
  );
}

export default SearchResult;
