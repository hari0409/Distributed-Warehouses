import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import DarkMode from "../Components/DarkMode/DarkMode";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import next from "next";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [errors, seterrors] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setpassword] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [phone, setPhone] = useState("");
  const [dup, setDup] = useState("");
  const [enableDelete, setEnableDelete] = useState(true);

  const router = useRouter();

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const body = {
        userId: userData._id,
        password: password,
      };
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/update/${userData?._id}`,
          body
        )
        .then((res) => {
          if (res.data.msg == "Updated") {
            alert("Password Updated Successfully");
            setEnabled(false);
            setpassword("");
            setDup("");
          }
        });
      setEnabled(true);
    } catch (error) {
      next(error);
    }
  };

  const submitLogout = () => {
    setUserData(null);
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    const body = {
      uid: userData._id,
      email: userData.email,
    };
    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/initdelete/${userData?._id}`,
          body
        )
        .then((res) => {
          if (res.data.msg == "Success") {
            alert("Link for deleting your account has been sent to your email");
            onClose();
          }
        })
        .catch((e) => {
          alert(e);
          onClose();
        });
    } catch (error) {
      alert(error);
    }
  };
  const updatePhone = async () => {
    try {
      const phoneNumer = Number(phone);
      const body = {
        email: email,
        phone: phoneNumer,
      };
      await axios
        .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/updatephone`, body)
        .then((res) => {
          if (res.data.msg == "Updated") {
            alert("Phone Number Updated Successfully");
            setPhone("");
            console.log(userData);
          }
        })
        .catch((e) => {
          alert(e);
        });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      try {
        setUserData(user);
        setName(user.name);
        setEmail(user.email);
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Please login first");
      router.replace("/login");
    }
  }, []);

  return (
    <>
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Edit you Profile</Heading>
          </Stack>
          <Box rounded={"lg"} boxShadow={"dark-lg"} p={8}>
            <Stack spacing={4}>
              <form onSubmit={handleChange}>
                <FormControl isInvalid={errors ? errors.name : null}>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" value={name} isDisabled={true} />
                  <FormLabel>Email</FormLabel>
                  <Input type="email" value={email} isDisabled={true} />
                  <Spacer my="10px" />
                  <hr style={{ background: "#9772FB", height: "1.2px" }} />
                  <Spacer my="10px" />
                  <FormLabel>Update Phone Number</FormLabel>
                  <Input
                    type="number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    placeholder="Enter new Nuber"
                  />
                  <Center>
                    <Button
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "yellow.500",
                      }}
                      style={{
                        marginTop: "10px",
                      }}
                      onClick={updatePhone}
                    >
                      Update Mobile Number
                    </Button>{" "}
                  </Center>
                  <Spacer my="10px" />
                  <hr style={{ background: "#9772FB", height: "1.2px" }} />
                  <Spacer my="10px" />
                  <FormLabel>Update Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setpassword(e.target.value);
                    }}
                    placeholder="Enter new password"
                  />
                  <Input
                    my={2}
                    type="password"
                    onChange={(e) => {
                      setDup(e.target.value);
                      if (e.target.value == password) {
                        setEnabled(false);
                      }
                    }}
                    value={dup}
                    placeholder="Confirm new password"
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
                    isDisabled={enabled}
                    type="submit"
                  >
                    Update
                  </Button>
                  <DarkMode />
                  <Button
                    backgroundColor="red"
                    onClick={() => {
                      onOpen();
                    }}
                  >
                    Delete Account
                  </Button>
                  <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    scrollBehavior="inside"
                    size="xl"
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Delete My Account:</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <Text>
                          Enter "Delete my account" in the below Text Box
                        </Text>
                        <Input
                          my={2}
                          type="text"
                          onChange={(e) => {
                            if (e.target.value === "Delete my account") {
                              setEnableDelete(false);
                            }
                          }}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                          </Button>
                          <Button
                            background="red"
                            isDisabled={enableDelete}
                            onClick={deleteAccount}
                          >
                            Confirm
                          </Button>
                        </ModalFooter>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  <Button backgroundColor="#FFAB76" onClick={submitLogout}>
                    Logout from this device.
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}

export default ProfilePage;
