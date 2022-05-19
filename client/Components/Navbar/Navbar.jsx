import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { useRouter } from "next/router";
import Notification from "@material-ui/icons/NotificationsNone";
import Badge from "@material-ui/core/Badge";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import Head from "next/head";

function Navbar() {
  const [userlogged, setUserlogged] = useState(null);
  const [id, setId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [count, setCount] = useState(0);
  const [init, setInit] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const generateInitials = (name) => {
    const n = name.split(" ");
    if (n.length >= 2) {
      let initials =
        n[0].charAt(0).toUpperCase() + n[1].charAt(0).toUpperCase();
      return initials;
    }
    let initials = n[0].charAt(0).toUpperCase();
    return initials;
  };

  const getRecent = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/getRecent/${id}`)
      .then((res) => {
        if (res.data) {
          setActivities(res?.data.updateFlags);
          setCount(res?.data.updateFlags.length);
          const init = generateInitials(userlogged?.name);
          setInit(init);
        }
      });
  };

  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      setUserlogged(user);
      setId(user._id);
      if (id) {
        getRecent();
      }
    }
  }, [count, id]);

  const handleDismiss = async (nid) => {
    const body = {
      userId: id,
      nid: nid,
    };
    await axios.post(
      `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/dismiss`,
      body
    );
    setActivities(activities.filter((activity) => activity.nid !== nid));
    setCount(count - 1);
  };

  return (
    <Flex
      position={"relative"}
      p={2}
      display={{ base: "none", md: "flex" }}
      justifyContent="space-between"
      alignItems="center"
      bgColor="#30AADD"
    >
      <Head>
        <title>WaRent</title>
        <meta
          name="description"
          content="Globally Distributed Shared warehouse"
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Flex color="white">
        <Center w="125px">
          <Image src={logo} width="100%" height="100%" />
          <Box>
            <Text fontSize="lg">
              <Link
                textDecoration="none!Important"
                href={userlogged ? "/dashboard" : "/"}
              >
                WaRent
              </Link>
            </Text>
          </Box>
        </Center>
      </Flex>
      <Box mr={"3rem"}>
        <ButtonGroup m={2}>
          {userlogged && (
            <Box mx={3} my="2">
              <header
                onClick={() => {
                  onOpen();
                }}
              >
                <Badge badgeContent={count} color="secondary">
                  <Notification style={{ fontSize: "30px" }} />
                  <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    scrollBehavior="inside"
                    size="xl"
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Recent Activities</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        {count == 0 && (
                          <>
                            <Text>No Recent Activity</Text>
                          </>
                        )}
                        {Object.values(activities).map((a, i) => {
                          return (
                            <>
                              <HStack>
                                <h1>
                                  {a.msg} {a.lid}
                                </h1>
                                <AiOutlineCloseCircle
                                  color="red"
                                  onClick={() => {
                                    handleDismiss(a._id);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  size="20px"
                                />
                              </HStack>
                              <br />
                            </>
                          );
                        })}
                      </ModalBody>
                      <ModalFooter />
                    </ModalContent>
                  </Modal>
                </Badge>
              </header>
            </Box>
          )}
          <Link href="/declare">
            <Button backgroundColor="#FFAB76">Lease a Land</Button>
          </Link>
          <Link href="/rentnow">
            <Button backgroundColor="#FFAB76">Rent Your Space</Button>
          </Link>
          {userlogged ? (
            <>
              <Link href="/dashboard">
                <Button backgroundColor="#FFAB76">Dashboard</Button>
              </Link>{" "}
              <Box
                style={{
                  width: "35px",
                  height: "35px",
                  lineHeight: "35px",
                  borderRadius: "50%",
                  fontSize: "15px",
                  color: "#fff",
                  textAlign: "center",
                  background: "#000",
                }}
              >
                <a href={`/profile`} style={{ textDecoration: "none" }}>
                  <Text>{init}</Text>
                </a>{" "}
              </Box>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button backgroundColor="#FFAB76">Login</Button>
              </Link>
              <Link href="/signup">
                <Button backgroundColor="#FFAB76">SignUp</Button>
              </Link>
            </>
          )}
        </ButtonGroup>
      </Box>
    </Flex>
  );
}

export default Navbar;
