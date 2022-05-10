import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Link,
  Text,
} from "@chakra-ui/react";

function ConfirmRent() {
  const router = useRouter();

  const [wData, setWData] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [bill, setBill] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getData = async (wId) => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/${wId}`)
      .then((res) => {
        setWData(res.data);
      })
      .catch((e) => {
        alert(e);
      });
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const dataObj = {
        landId: wData?._id,
        userId: user?._id,
        required: quantity,
      };
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/rent/${user?._id}`,
          dataObj
        )
        .then((res) => {
          alert(res.data);
          router.replace("/dashboard");
        })
        .catch((e) => {
          console.log(e);
          alert(e.response.data);
        });
      setIsSubmitting(false);
    } catch (error) {
      alert(error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const { wId } = router.query;
        getData(wId);
      } else {
        router.replace("/login");
      }
    }
  }, [router.isReady]);

  return (
    <>
      <Center style={{ marginTop: "50px" }}>
        <form onSubmit={submitHandler}>
          <FormControl>
            <Text fontSize={"7xl"} color={"#30AADD"}>
              {wData?.name}
            </Text>
            <Text fontSize={"xl"}>
              Address:{" "}
              <Text
                as="span"
                fontSize={"md"}
                color="#F24A72"
                fontWeight={"medium"}
              >
                {wData?.address}
              </Text>
            </Text>
            <Text fontSize={"xl"}>
              Cost per Ton:{" "}
              <Text
                fontSize={"5xl"}
                color={"#F900BF"}
                fontWeight={"bold"}
                as="span"
              >
                ₹{wData?.cost}
              </Text>
            </Text>
            <FormLabel htmlFor="name">Quantity</FormLabel>
            <Input
              placeholder="Quantity in Tons"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setBill(e.target.value * wData?.cost);
              }}
            />
            <Text fontSize={"xl"}>
              Total Cost:{"  "}
              <Text
                as="span"
                fontSize={"5xl"}
                color="#A63EC5"
                fontWeight={"bold"}
              >
                ₹{bill}
              </Text>
            </Text>
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Reserve
          </Button>
        </form>
      </Center>
    </>
  );
}

export default ConfirmRent;
