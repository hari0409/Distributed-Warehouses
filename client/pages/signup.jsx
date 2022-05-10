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
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";

function SignUp() {
  const [errors, seterrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const body = {
      name: name,
      email: email,
      password: password,
    };
    await axios
      .post(`${process.env.NEXT_PUBLIC_DB_LINK}/api/users/create`, body)
      .then(router.push("/dashboard"))
      .catch((err) => {
        seterrors({ name: err.response.data.message });
      });
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <>
      <Center style={{ marginTop: "50px" }}>
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={errors ? errors.name : null}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
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
            Already have an Account <br />
            <Link href="/login">Log-In here</Link>
          </Text>
        </form>
      </Center>
    </>
  );
}

export default SignUp;
