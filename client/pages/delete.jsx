import { Center, Text, VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { GridSpinner } from "react-spinners-kit";
import { useRouter } from "next/router";
import axios from "axios";

function Delete() {
  const router = useRouter();

  const deleteConfirm = async (body) => {
    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/deleteconfirm`,
          body
        )
        .then((res) => {
          if (res.data.msg == "Deleted") {
            alert("Account deleted successfully.Sorry to see you go. 😓");
            localStorage.removeItem("user");
            router.replace("/signup");
          } else {
            alert("Something went wrong. Please try again later.");
            localStorage.removeItem("user");
            router.replace("/signup");
          }
        })
        .catch((e) => {
          alert(e.response.data.msg);
          localStorage.removeItem("user");
          router.replace("/signup");
        });
    } catch (error) {
      alert(error);
      localStorage.removeItem("user");
      router.replace("/signup");
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const token = router.query.token;
      const uid = router.query.uid;
      const body = {
        token: token,
        uid: uid,
      };
      deleteConfirm(body);
    }
  }, [router.isReady]);
  return (
    <>
      <Center my={5}>
        <VStack>
          <Text fontSize="6xl" m="10">
            Verifying & Deleting your account
          </Text>
          <GridSpinner size={50} color="#F73D93" loading={true} />
        </VStack>
      </Center>
    </>
  );
}

export default Delete;
