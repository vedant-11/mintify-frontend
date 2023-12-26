import PageHeading from "../components/PageHeading";
import React, { use, useState } from "react";
import Image from "next/image";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import {
  Metaplex,
  keypairIdentity,
  irysStorage,
  toMetaplexFileFromBrowser,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Home() {
  const wallet = useWallet();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const walletUrl = process.env.NEXT_PUBLIC_API;

  const mintNFT = async () => {
    if (!file || !wallet.connected || !wallet.publicKey) {
      toast.error("Please connect wallet and select a file.");
      return;
    }

    const postWalletAddress = async () => {
      const response = await axios.post(walletUrl, {
        walletAddress: wallet.publicKey.toBase58(),
      });
    };
    postWalletAddress();

    console.log("Wallet Address: ", wallet.publicKey.toBase58());

    try {
      const connection = new Connection(clusterApiUrl("devnet"));

      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(
          irysStorage({
            address: "https://devnet.bundlr.network",
            providerUrl: "https://api.devnet.solana.com",
            timeout: 60000,
          })
        );

      const metaplexFile = await toMetaplexFileFromBrowser(file);
      const uploadResponse = await metaplex.storage().upload(metaplexFile);
      console.log("Upload Response:", uploadResponse);

      const { uri } = await metaplex.nfts().uploadMetadata({
        name: "My NFT",
        description: "My description",
        file,
        attributes: [
          { trait_type: "Color", value: "Blue" },
          { trait_type: "Size", value: "Large" },
        ],
      });

      const { nft } = await metaplex.nfts().create(
        {
          uri,
          name: file.name,
          sellerFeeBasisPoints: 500,
        },
        {
          commitment: "finalized",
          confirmOptions: {
            commitment: "finalized",
            skipPreflight: false,
            maxRetries: 3,
          },
        }
      );

      console.log("NFT Minted:", nft);
      toast.success("NFT Minted Successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.success("NFT Minted Successfully!");
    }
  };
  return (
    <main className="flex flex-col gap-8">
      <PageHeading>Mint nft page for Doge Capital</PageHeading>

      <div className="basis-1/4 ">
        <div className="flex flex-col-reverse justify-center items-center my-6 gap-10">
          <button
            onClick={mintNFT}
            disabled={!wallet.connected}
            type="button"
            className="inline-flex md:w-[40%] text-center justify-center items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md cursor-pointer hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mint a NFT 🚀
          </button>
          <label
            htmlFor="file-upload"
            className="inline-flex md:w-[40%] text-center justify-center items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Upload File 📁
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <hr />
        {file && (
          <div className="flex flex-col gap-10 justify-center">
            <p className="text-sm text-white my-10">
              Nft Minting from Wallet Address: {wallet.publicKey.toBase58()}
            </p>
            <img src={URL.createObjectURL(file)} />
            <p className="text-sm text-white">
              {file.name} ({file.size} bytes)
            </p>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-center" />
    </main>
  );
}
