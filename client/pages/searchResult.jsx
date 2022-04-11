import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react";
import WarehouseElement from "../Components/WarehouseElement/WarehouseElement";

function SearchResult() {
  const router = useRouter();
  const [search, setSearch] = useState(null);
  const [results, setResults] = useState(null);

  const getResult = async () => {
    const data = {
      "locations:": [search],
    };
    const res = await axios.patch(
      "http://localhost:5000/api/warehouse/locations",
      data
    );
    setResults(res.data);
  };
  useEffect(() => {
    const searchQuery = router.query.searchQuery;
    setSearch(searchQuery);
    getResult();
  }, []);
  return (
    <>
      <Flex justifyContent="start" marginLeft="10px">
        <Box>
          <Text fontSize="2xl" m={5}>Search Result for {search}</Text>
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
