import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Cards from "../components/Cards";
import LoanCalculator from "../components/LoanCalculator";
import Exchange from "../components/Exchange";
import FAQ from "../components/FAQ";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>FINTECH GROUP 4</title>
      </Head>
      <Navbar />
      <Hero />
      <Cards />
      <LoanCalculator />
      <Exchange />
      <FAQ />
    </>
  );
}
