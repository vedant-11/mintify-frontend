import React, { FC, useState, useEffect, use } from "react";
import PageHeading from "../components/PageHeading";
import axios from "axios";
import Link from "next/link";
const wallet: FC = () => {
  const [walletAddress, setWalletAddress] = useState([]);
  const walletUrl = process.env.NEXT_PUBLIC_API;
  useEffect(() => {
    const getWalletAddress = async () => {
      const response = await axios.get(walletUrl);
      setWalletAddress(response.data);
    };
    getWalletAddress();
  });

  return (
    <div>
      <PageHeading>
        List of all the wallet addresses that have minted an NFT
      </PageHeading>
      <div className="my-10">
        {walletAddress.length > 0 &&
          walletAddress.map(({ walletAddress, index }) => (
            <div key={index}>
              <h2 className="text-white font-medium">{walletAddress}</h2>
            </div>
          ))}
      </div>
      <Link href="/">
        <button
          type="button"
          className="inline-flex md:w-[40%] text-center justify-center items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md cursor-pointer hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mint a NFT Now 🚀
        </button>
      </Link>
    </div>
  );
};

export default wallet;
