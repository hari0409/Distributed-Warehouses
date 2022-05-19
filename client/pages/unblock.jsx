import { Center, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect,useState } from "react";
import { GridSpinner } from "react-spinners-kit";

function Unblock() {
  const router = useRouter();
  const [status, setstatus] = useState(true);
  const unblock = async () => {
    const token = router.query.token;
    const email = router.query.email;
    const body = {
      token: token,
      email: email,
    };
    await axios
      .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/unblock`, body)
      .then((res) => {
        alert(res.data.msg);
        router.replace("/dashboard");
      })
      .catch((e) => {
        alert(e.response.data.msg);
        setstatus(false);
      });
  };
  useEffect(() => {
    if (router.isReady) {
      unblock();
    }
  }, [router.isReady]);
  return (
    <>
      {status ? (
        <Center my={5}>
          <VStack>
            <Text fontSize="6xl" m="10">
              Verifying & Unblocking
            </Text>
            <GridSpinner size={50} color="#F73D93" loading={true} />
          </VStack>
        </Center>
      ) : (
        <Center my={5}>
          <VStack>
            <Text fontSize="6xl" m="10">
              Invalid Token{" "}
            </Text>
            <Text fontSize="7xl">😑</Text>
          </VStack>
        </Center>
      )}
    </>
  );
}

export default Unblock;
