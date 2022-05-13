import {
  Box,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Map from "../Map/Map";

export default function Simple({ prod, imgLink }) {
  const router = useRouter();

  const [name, setName] = useState(null);
  const [mapData, setMapData] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 13,
  });
  const [loaded, setLoaded] = useState(false);

  const getName = async () => {
    try {
      if (prod?.owner) {
        await axios
          .get(
            `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/getname/${prod?.owner}`
          )
          .then((res) => {
            setName(res.data);
          })
          .catch((e) => {
            alert(e);
          });
      }
    } catch (error) {
      alert(error);
    }
  };

  const getLatLong = async () => {
    const options = {
      method: "GET",
      url: "https://trueway-geocoding.p.rapidapi.com/Geocode",
      params: { address: prod?.address, language: "en" },
      headers: {
        "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
        "X-RapidAPI-Key": "8f7f841c61msh4eedbdce8329e29p1afb0ajsne15575ae6adb",
      },
    };
    await axios
      .request(options)
      .then((response) => {
        setMapData({
          ...mapData,
          latitude: response?.data?.results[0]?.location?.lat,
          longitude: response?.data?.results[0]?.location?.lng,
        });
        setLoaded(true);
      })
      .catch((e) => {});
  };
  useEffect(() => {
    getName();
    getLatLong();
  }, [prod]);

  return (
    <>
      <Container maxW={"7xl"}>
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 18, md: 24 }}
        >
          <Flex>
            <Image
              rounded={"md"}
              alt={"product image"}
              src={imgLink}
              fit={"cover"}
              align={imgLink}
              w={"100%"}
              h={{ base: "100%", sm: "400px", lg: "500px" }}
            />
          </Flex>
          <Stack spacing={{ base: 6, md: 10 }}>
            <Box as={"header"}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {prod?.name}
              </Heading>
              <Text
                color={useColorModeValue("gray.900", "gray.400")}
                fontWeight={300}
                fontSize={"2xl"}
              >
                Cost:{" ₹" + prod?.cost} / ton
              </Text>
            </Box>

            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={"column"}
              divider={
                <StackDivider
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                />
              }
            >
              <VStack spacing={{ base: 4, sm: 6 }}>
                <Text fontSize={"lg"}>Description: {" " + prod?.desc}</Text>
                <Text fontSize={"lg"}>Owner: {" " + name}</Text>
              </VStack>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color={useColorModeValue("yellow.500", "yellow.300")}
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  Details
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                  <List spacing={2}>
                    <ListItem>Address:{" " + prod?.address}</ListItem>
                    <ListItem>
                      AC:{" "}
                      {prod?.airConditioner ? (
                        <span>Yes</span>
                      ) : (
                        <span>No</span>
                      )}
                    </ListItem>
                    <ListItem>
                      Total Avaialable Units:{" " + prod?.totalUnits}
                    </ListItem>
                    <ListItem>
                      Currently Avaialable Units:{" " + prod?.availableUnits}
                    </ListItem>
                    <ListItem>
                      Show Direction:{" "}
                      <Button bg={"red"} size="sm" color={"black"}>
                        <Link
                          href={`http://maps.google.com/maps?z=12&t=m&q=loc:${mapData.latitude}+${mapData.longitude}`}
                          passHref
                        >
                          <a target="_blank" rel="noopener noreferrer">
                            Directions
                          </a>
                        </Link>
                      </Button>
                    </ListItem>
                  </List>
                </SimpleGrid>
              </Box>
              <Box>
                <Text
                  fontSize={{ base: "16px", lg: "18px" }}
                  color={useColorModeValue("yellow.500", "yellow.300")}
                  fontWeight={"500"}
                  textTransform={"uppercase"}
                  mb={"4"}
                >
                  Actions:
                </Text>
                <Button
                  bg={"#E78EA9"}
                  onClick={() => {
                    router.replace(`confirm/${prod?._id}`);
                  }}
                >
                  Request for Space..
                </Button>
              </Box>
            </Stack>
          </Stack>
        </SimpleGrid>
        <Text
          fontSize={{ base: "16px", lg: "18px" }}
          color={useColorModeValue("yellow.500", "yellow.300")}
          fontWeight={"500"}
          textTransform={"uppercase"}
          mt={"-30px"}
          mb={1}
        >
          Map:
        </Text>
        <div style={{ marginBottom: "20px" }}>
          {loaded && <Map mapData={mapData} />}
        </div>
      </Container>
      {/* Align flex content down */}
    </>
  );
}
