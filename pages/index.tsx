import { Inter } from "next/font/google";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import ManualHeader from "../components/ManualHeader";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Our Smart Contract Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManualHeader />
      asdf
    </div>
  );
}
