'use client'
import { DynamicWidget } from "../lib/dynamic";

import Image from "next/image";
import Logo from './logo.png'
import {
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter()
  const { primaryWallet, user } = useDynamicContext();
  const isConnected= primaryWallet?.connected;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center flex-col justify-between font-mono text-sm lg:flex">
        {/* <div className={"w-60 mb-10"}>
        <Image src={Logo} alt="Logo" />
        </div> */}
        <DynamicWidget innerButtonComponent={undefined}/>
        {isConnected && <>
          <div className="flex gap-4 mt-20">
        <button type="button"  style={{
              background: "rgb(201, 247, 58)",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              fontWeight: "bold",
              color: "black",
            }} onClick={() => router.push('/onramp')}>
         Onramp
        </button>
        <button type="button"  style={{
              background: "rgb(201, 247, 58)",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              fontWeight: "bold",
              color: "black",
            }} onClick={() => router.push('/offramp')}>
         Offramp
        </button>
        <button type="button"  style={{
              background: "rgb(201, 247, 58)",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              fontWeight: "bold", 
              color: "black",
            }} onClick={() => router.push('/mint')}>
         Mint NFT in Batch Tx
        </button>
        </div>
        </>
        }
        
      </div>
    </main>
  );
}
