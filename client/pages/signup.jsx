import { useRouter } from "next/router";
import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Link,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Head from "next/head";

function SignUp() {
  const [errors, seterrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [session1, setSession1] = useState(true);
  const [mail, setMail] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const body = {
      password: password,
      token: router.query.token,
      email: router.query.email,
    };
    await axios
      .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/create`, body)
      .then((res) => {
        router.push("/login");
      })
      .catch((err) => {
        alert(err);
      });
    setIsSubmitting(false);
  };

  const handleVerify = async (e) => {
    try {
      setIsSubmitting(true);
      e.preventDefault();
      const body = {
        email: email,
        name: name,
      };
      axios
        .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/verify`, body)
        .then((res) => {
          if (res.data.msg == "Success") {
            setMail(true);
          }
        })
        .catch((e) => {
          alert(e.response.data.msg);
        });
      setIsSubmitting(false);
    } catch (error) {
      alert(err);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const msg = router.query.msg;
      const mail = router.query.email;
      console.log(msg, mail);
      if (msg == "Verified") {
        setSession1(false);
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
      <Center style={{marginTop:"40px"}}>
        <Text fontSize="3xl">Signup</Text>
      </Center>
      {session1 && (
        <Center style={{ marginTop: "50px" }}>
          <form onSubmit={handleVerify}>
            <FormControl isInvalid={errors ? errors.name : null}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                width="auto"
              />
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                width="auto"
              />
              <br />
              <br />
              <Button colorScheme="teal" isLoading={isSubmitting} type="submit">
                Verify Email
              </Button>
            </FormControl>
            {mail && (
              <Text>
                Email has been sent for verification.You can now close this
                window.
              </Text>
            )}
          </form>
        </Center>
      )}
      {!session1 && (
        <Center style={{ marginTop: "50px" }}>
          <form onSubmit={handleSubmit}>
            <FormControl isInvalid={errors ? errors.name : null}>
              <FormLabel>Password</FormLabel>
              <Input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
              />
              <FormLabel>Repeat Password</FormLabel>
              <Input
                onChange={(e) => {
                  if (e.target.value == password) {
                    setEnabled(true);
                  }
                }}
                type="password"
              />
              <Button
                my={2}
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
                isDisabled={!enabled}
              >
                Sign Up
              </Button>
            </FormControl>
          </form>
        </Center>
      )}
    </>
  );
}

export default SignUp;
