import { Box, Flex, Heading, HStack, Spacer, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useGeoLocation from "../../lib/geoLocation";
import WarehouseElement from "../WarehouseElement/WarehouseElement";

function Recomended() {
  const location = useGeoLocation();
  const [lError, setLError] = useState(false);
  const [locationData, setLocationData] = useState(null);

  const getLocations = async (lat, lng) => {
    const options = {
      method: "GET",
      url: "https://geocodeapi.p.rapidapi.com/GetNearestCities",
      params: { latitude: lat, longitude: lng, range: "0" },
      headers: {
        "X-RapidAPI-Host": "geocodeapi.p.rapidapi.com",
        "X-RapidAPI-Key": "8f7f841c61msh4eedbdce8329e29p1afb0ajsne15575ae6adb",
      },
    };
    await axios
      .request(options)
      .then(async (response) => {
        if (response.data) {
          let data = [];
          for (let i = 0; i < response.data.length; i++) {
            data.push(response.data[i].City.toLowerCase());
          }
          const locArray = {
            locations: data,
          };
          await axios
            .patch(`${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/locations`, locArray)
            .then((res) => {
              console.log(res.data);
              setLocationData(res.data);
            });
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  useEffect(() => {
    if (location.loaded && location.coordinates) {
      const { lat, lng } = location.coordinates;
      getLocations(lat, lng);
    } else {
      setLError(true);
    }
  }, [location.loaded]);
  return (
    <>
      <Flex justifyContent="start" marginLeft="10px">
        <Box>
          <Text fontSize="2xl">Recomended</Text>
          <Spacer my={2} />
          <HStack>
            {locationData ? (
              <>
                {locationData.map((e) => {
                  return (
                    <>
                      <WarehouseElement e={e} status="recomended" key={e._id} />
                    </>
                  );
                })}
              </>
            ) : (
              <Text>No Land Or Warehouse</Text>
            )}
          </HStack>
        </Box>
      </Flex>
    </>
  );
}

export default Recomended;
