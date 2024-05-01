'use client'
import { DynamicWidget } from "../lib/dynamic";
import OnrampExample from "./OnrampExample";
import Transaction from "./transaction";
import Image from "next/image";
import Logo from './logo.png'
import OfframpExample from "./OfframpExample";
import SendTransaction from "./sendCryptoTransaction";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center flex-col justify-between font-mono text-sm lg:flex">
        <div className={"w-90 mb-10"}>
        <Image src={Logo} alt="Logo" />
        </div>
        <DynamicWidget innerButtonComponent={undefined}/>
        <Transaction/>
        <OnrampExample/>
        <OfframpExample/>
        <SendTransaction/>
      </div>
    </main>
  );
}
