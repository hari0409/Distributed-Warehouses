import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Stack,
  Heading,
  Box,
  Text,
  FormControl,
  Button,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  Checkbox,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Declare() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, seterrors] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter();
  const [wDetails, setWDetails] = useState(null);

  const [name, setName] = useState("");
  const [area, setArea] = useState(0.5);
  const [address, setAddress] = useState("");
  const [tags, setTags] = useState("");
  const [cost, setcost] = useState(7000);
  const [ac, setAc] = useState(false);
  const [img, setImg] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedInUser(user);
    } else {
      router.replace("/login");
    }
  }, []);

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(!isSubmitting);
      let locationTags = tags.split(",");
      const newTags = locationTags.map((e) => {
        return e.toLowerCase().trim();
      });
      let mapper = {
        fileId: null,
        warehouseId: null,
      };
      const imgForm = new FormData();
      imgForm.append("file", img);
      await axios
        .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/images/upload`, imgForm)
        .then((res) => {
          mapper.fileId = res.data.file.id;
        })
        .catch((e) => {
          alert(e);
        });
      const data = {
        owner: loggedInUser._id,
        name: name,
        totalUnits: area * 100,
        cost: cost,
        locationTags: newTags,
        address: address,
        availableUnits: area * 100,
        airConditioner: ac,
        desc:desc
      };
      await axios
        .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/create`, data)
        .then((res) => {
          mapper.warehouseId = res.data._id;
        })
        .catch((e) => {
          toast.error("Error Occured");
          seterrors({ name: e.response.data.message });
        });
      await axios
        .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/map/upload`, mapper)
        .then((res) => {
          router.push("/dashboard");
        })
        .catch((e) => {
          alert(e);
        });
      setIsSubmitting(false);
    } catch (error) {
      alert(error);
      setIsSubmitting(false);
    }
  };

  const onImageUpload = async (e) => {
    e.preventDefault();
    setImg(e.target.files[0]);
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
              <form onSubmit={submitHandler} encType="multipart/form-data">
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
                  >
                    Air-Conditioned
                  </Checkbox>
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
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
                  <FormLabel>
                    Describe your land
                  </FormLabel>
                  <Textarea
                    resize="block"
                    type="text"
                    value={desc}
                    onChange={(e) => {
                      setDesc(e.target.value);
                    }}
                  />
                  <Flex m={4}>
                    <input
                      type="file"
                      onChange={(e) => {
                        onImageUpload(e);
                      }}
                      name="file"
                    />
                  </Flex>
                  <FormErrorMessage>
                    {errors ? errors.name : null}
                  </FormErrorMessage>
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    style={{
                      marginTop: "10px",
                    }}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Register
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

export default Declare;
