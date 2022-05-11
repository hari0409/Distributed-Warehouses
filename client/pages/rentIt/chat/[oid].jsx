import React,{useEffect} from "react";
import { useRouter } from "next/router";
import Head from "next/head";


function Chat() {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      console.log(router.query.oid);
    }
  }, [router.isReady]);
  return <div>Chat</div>;
}

export default Chat;  