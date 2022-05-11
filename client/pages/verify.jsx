import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Center, Text } from "@chakra-ui/react";
import axios from "axios";

function verify() {
  const router = useRouter();
  const verifyEmail = async () => {
    try {
      if (router.isReady) {
        const body = {
          email: router.query.email,
          token: router.query.token,
        };
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/verification`,
            body
          )
          .then((res) => {
            if (res.data.msg == "Verified") {
              router.push(
                `/signup?msg=Verified&token=${router.query.token}&email=${router.query.email}`
              );
            } else {
              alert(res.data.msg);
              router.replace("/signup")
            }
          })
          .catch((e) => {
            alert(e.response.data.msg);
          });
      }
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      verifyEmail();
    }
  }, [router.isReady]);
  return (
    <>
      <Center my={5}>
        <Text fontSize="6xl">Verifying your Email</Text>
      </Center>
    </>
  );
}

export default verify;
