
import type { NextPage } from "next";
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import Image from "next/image"
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    router.push(`/create`).catch((err) =>  console.log(err))
  }, [isConnected, router])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{" "}
          <a href="#">
            Rock Paper Scissor Lizard Spock
          </a>
        </h1>
        <Image
          src="/RPSLS.webp"
          width={500}
          height={500}
          alt="Picture of the author"
        />
        <p className={styles.description}>
          Connect your wallet and start playing around
        </p>
      </main>
    </div>
  );
};

export default Home;
