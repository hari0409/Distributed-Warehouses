import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import axios from "axios";

function EditWarehouse() {
  const router = useRouter();
  const [errors, seterrors] = useState(null);

  const getData = async () => {
    const { warehouseId } = router.query;
    const response = await axios.get(
      `http://localhost:5000/api/warehouse/${warehouseId}`
    );
    const warehouse = response.data;
    console.log(warehouse);
    setName(warehouse.name);
    setArea(warehouse.totalUnits / 100);
    setAddress(warehouse.address);
    setcost(warehouse.cost);
    setAc(warehouse.ac);
    let data = warehouse.locationTags;
    data = data.join(",");
    setTags(data);
  };

  const [name, setName] = useState("");
  const [area, setArea] = useState(0.5);
  const [address, setAddress] = useState("");
  const [tags, setTags] = useState("");
  const [cost, setcost] = useState(7000);
  const [ac, setAc] = useState(false);

  useEffect(() => {
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    if (!user) {
      router.push("/login");
    } else {
      if (router.isReady) {
        getData();
      }
    }
  }, [router.isReady]);

  const edithandler = async (e) => {
    e.preventDefault();
    setAc(ac);
    setcost(cost);
    setAddress(address);
    setArea(area);
    setName(name);
    setTags(tags);
    let locationTags = tags.split(",");
    const newTags = locationTags.map((e) => {
      return e.toLowerCase().trim();
    });
    const data = {
      ownerId: JSON.parse(localStorage.getItem("user"))._id,
      name: name,
      totalUnits: area * 100,
      address: address,
      locationTags: newTags,
      cost: cost,
      airConditioner: ac,
    };
    await axios
      .put(
        `http://localhost:5000/api/warehouse/update/${router.query.warehouseId}`,
        data
      )
      .then(() => {
        router.push("/dashboard");
      })
      .catch((e) => {
        seterrors({ name: e.response.data.message });
      });
  };

  return (
    <>
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Declare your Land</Heading>
            <Text fontSize={"lg"}>to be made as a Warehouse </Text>
          </Stack>
          <Box rounded={"lg"} boxShadow={"dark-lg"} p={8}>
            <Stack spacing={4}>
              <form onSubmit={edithandler}>
                <FormControl isInvalid={errors ? errors.name : null}>
                  <FormLabel>Name your land</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <FormLabel>Total Area(in acres)</FormLabel>
                  <Input
                    type="number"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                    }}
                    isDisabled={true}
                  />
                  <FormLabel>Desired cost per ton (₹)</FormLabel>
                  <Input
                    type="number"
                    value={cost}
                    onChange={(e) => {
                      setcost(e.target.value);
                    }}
                  />
                  <Checkbox
                    my={2}
                    onChange={() => {
                      setAc(!ac);
                    }}
                    defaultChecked={ac}
                  >
                    Air-Conditioned
                  </Checkbox>
                  <FormLabel>Address</FormLabel>
                  <Textarea type="text" value={address} isDisabled={true} />
                  <FormLabel>
                    Tags(Describe your nearby locations) with ","
                  </FormLabel>
                  <Textarea
                    resize="block"
                    type="text"
                    value={tags}
                    onChange={(e) => {
                      setTags(e.target.value);
                    }}
                  />
                  <FormErrorMessage>
                    {errors ? errors.name : null}
                  </FormErrorMessage>
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "yellow.500",
                    }}
                    style={{
                      marginTop: "10px",
                    }}
                    type="submit"
                  >
                    Update
                  </Button>
                  <ToastContainer />
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export default EditWarehouse;
