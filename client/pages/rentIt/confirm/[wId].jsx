import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
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
import Head from "next/head";
import { v4 as uuidv4 } from "uuid";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function ConfirmRent() {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [wData, setWData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [bill, setBill] = useState(0);
  const [pin, setPin] = useState("");
  const [order, setOrder] = useState(null);
  const [pid, setPid] = useState(null);
  const [verified, setVerified] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay failed to load. Are you online?");
      return;
    }
    const options = {
      key: process.env.NEXT_PUBLIC_RAZOR_KEY,
      currency: "INR",
      amount: wData.cost * quantity * 100,
      order_id: order?.id,
      name: "WareRent Payment",
      description: "Thank you for using WareRent",
      handler: function (response) {
        setPid(response.razorpay_payment_id);
        updateOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: userData?.name,
        email: userData?.email,
        phone_number: userData?.phoneNumber,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

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

  const intitiatePay = async () => {
    try {
      const orderBody = {
        amount: quantity * wData?.cost * 100,
        uuid: uuidv4(),
      };
      await axios
        .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/order`, orderBody)
        .then((res) => {
          setOrder(res.data.responce);
          displayRazorpay();
        })
        .catch((e) => {
          alert(e);
        });
    } catch (error) {
      alert(error);
    }
  };

  const submitHandler = async () => {
    try {
      const dataObj = {
        landId: wData?._id,
        userId: userData?._id,
        required: quantity,
      };
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/rent/${userData?._id}`,
          dataObj
        )
        .then((res) => {
          alert(res.data);
          router.replace("/dashboard");
        })
        .catch((e) => {
          alert(e.response.data + "Error while allocating resources");
        });
    } catch (error) {
      alert(error);
    }
  };

  const verifyPin = async () => {
    try {
      const body = {
        email: userData?.email,
        pin: pin,
      };
      console.log(wData);
      if (quantity > 0 && quantity <= wData?.availableUnits) {
        await axios
          .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/verifypin`, body)
          .then(async () => {
            setVerified(true);
            setPin("");
            onClose();
          })
          .catch((e) => {
            alert(e.response.data.msg);
          });
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
        alert("Quantity cannot be 0 or quantity unavailable");
      }
    } catch (error) {
      alert(error);
    }
  };

  const updateOrder = async (payId) => {
    try {
      const body = {
        amount: bill,
        pid: payId,
        email: userData?.email,
        lid: wData?.name,
        quantity: quantity,
      };
      console.log(body);
      await axios
        .patch(
          `${process.env.NEXT_PUBLIC_DB_LINK}/api/users/confirmpayment`,
          body
        )
        .then(() => {
          submitHandler();
        })
        .catch((e) => {
          alert(e);
        });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (router.isReady && pid == null) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const { wId } = router.query;
        getData(wId);
        setUserData(user);
      } else {
        router.replace("/login");
      }
    }
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>WaRent</title>
        <meta
          name="description"
          content="Globally Distributed Shared warehouse"
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
      <Center style={{ marginTop: "50px" }}>
        <form>
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
            <FormLabel htmlFor="name">Quantity(tons)</FormLabel>
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
          {verified ? (
            <>
              <Button onClick={intitiatePay} color="#FFCD38">
                Confirm & proceed to Payment.
              </Button>
            </>
          ) : (
            <>
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={isSubmitting}
                onClick={() => {
                  onOpen();
                  setIsSubmitting(true);
                }}
              >
                Reserve
              </Button>
              <Modal
                isOpen={isOpen}
                onClose={() => {
                  onClose();
                  setIsSubmitting(false);
                }}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Confirm Reservation</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    Enter Pin to continue your transaction
                    <Input
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                      }}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={() => {
                        setIsSubmitting(false);
                        onClose();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ background: "#F806CC" }}
                      onClick={verifyPin}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          )}
        </form>
      </Center>
    </>
  );
}

export default ConfirmRent;
