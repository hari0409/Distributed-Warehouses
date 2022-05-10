import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>WaRent</title>
        <meta
          name="description"
          content="Globally Distributed Shared warehouse"
        />
        <link rel="icon" href="/logo.ico" />
      </Head>
    </div>
  );
}
