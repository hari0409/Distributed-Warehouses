import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Center, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { GridSpinner } from "react-spinners-kit";

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
              alert("Error while verification");
              router.replace("/signup");
            }
          })
          .catch((e) => {
            alert("Error while Verification");
            router.replace("/signup");
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
        <VStack>
          <Text fontSize="6xl" m="10">
            Verifying your Email
          </Text>
          <GridSpinner size={50} color="#F73D93" loading={true} />
        </VStack>
      </Center>
    </>
  );
}

export default verify;
