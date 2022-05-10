import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Link,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";

function Login() {
  const [errors, seterrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const body = {
      email: email,
      password: password,
    };
    await axios
      .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/login`, body)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        router.push("/dashboard");
        setIsSubmitting(false);
      })
      .catch((err) => {
        seterrors({ name: err.response.data.message });
        setIsSubmitting(false);
        return;
      });
  };

  useEffect(() => {
    if (router.isReady) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        router.push("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [router.isReady]);

  return (
    <>
      <Center style={{ marginTop: "50px" }}>
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={errors ? errors.name : null}>
            <FormLabel htmlFor="name">Email</FormLabel>
            <Input
              placeholder="Email-id"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
            />
            <FormLabel htmlFor="name">Password</FormLabel>
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
            />
            <FormErrorMessage>{errors ? errors.name : null}</FormErrorMessage>
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
          <Text style={{ marginTop: "10px" }}>
            Dont have an account.
            <br />
            <Link href="/signup">Create one here</Link>
          </Text>
        </form>
      </Center>
    </>
  );
}

export default Login;
