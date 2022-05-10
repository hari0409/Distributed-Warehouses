  import { Flex, Spacer } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Simple from "../../Components/Simple/Simple";

function RentIt() {
  const router = useRouter();
  const [prodDetails, setProdDetails] = useState(null);
  const [imgLink, setImgLink] = useState("");

  const getDetails = async (rentId) => {
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/warehouse/${rentId}`)
        .then((res) => {
          console.log(res.data);
          setProdDetails(res.data);
        })
        .catch((err) => console.log(err));
      await axios
        .get(`${process.env.NEXT_PUBLIC_DB_LINK}/api/map/${rentId}`)
        .then(async (res) => {
          setImgLink(
            `${process.env.NEXT_PUBLIC_DB_LINK}/api/images/${res.data.fileId}`
          );
        })
        .catch((err) => alert(err));
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const user = localStorage.getItem("user");
      const userData = JSON.parse(user);
      const { rentId } = router.query;
      if (userData) {
        getDetails(rentId);
      } else {
        router.replace("/login");
      }
    }
  }, [router.isReady]);

  return (
    <Flex>
      <Simple prod={prodDetails} imgLink={imgLink} />
    </Flex>
  );
}

export default RentIt;
