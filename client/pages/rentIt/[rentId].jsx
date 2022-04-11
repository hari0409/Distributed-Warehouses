import { Flex } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function RentIt() {
  const router = useRouter();
  const [prodId, setProdId] = useState("");
  const [prodDetails, setProdDetails] = useState(null);

  const getDetails = async (rentId) => {
    const res = await axios
      .get(`http://localhost:5000/api/warehouse/${rentId}`)
      .catch((err) => console.log(err));
    setProdDetails(res.data);
  };

  useEffect(() => {
    if (router.isReady) {
      const user = localStorage.getItem("user");
      const userData = JSON.parse(user);
      const { rentId } = router.query;
      if (userData) {
        setProdId(rentId);
        getDetails(rentId);
      }
    }
  }, [router.isReady]);

  return (
    <Flex>
      <h1>RentIt</h1>
      {
        prodDetails?.name
      }
    </Flex>
  );
}

export default RentIt;
