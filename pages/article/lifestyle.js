import Head from "next/head";
import styles from '@/styles/Styles.module.css'

export default function Lifestyle() {
  return (
    <>
      <Head>
        <title>Lifestyle</title>
        <meta name="description" content="Learn more about us" />
      </Head>
      <h1 className={styles.heading}>Lifestyle</h1>
      <p>This is the About Us page.</p>
    </>
  );
}
