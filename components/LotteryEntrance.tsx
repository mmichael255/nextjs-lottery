import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants/index";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers, ContractTransaction } from "ethers";
import { useNotification } from "web3uikit";

interface contractAddressesInterface {
  [key: string]: string[];
}

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const dispatch = useNotification();
  const addresses: contractAddressesInterface = contractAddresses;
  const chainId: string = parseInt(chainIdHex!).toString();
  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setnumPlayers] = useState("0");
  const [recentWinner, setrecentWinner] = useState("0");
  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getRecentWinner",
    params: {},
  });

  async function updateUI() {
    const entranceFeeFromContract = (
      (await getEntranceFee()) as BigInt
    ).toString();
    setEntranceFee(entranceFeeFromContract);
    setnumPlayers(((await getNumberOfPlayers()) as BigInt).toString());
    setrecentWinner((await getRecentWinner()) as string);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const handleSuccess = async (tx: ContractTransaction) => {
    await tx.wait(1);
    handleNewNotification();
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Success",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="py-5">
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async () => {
              await enterRaffle({
                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>Entrance Fee:{ethers.utils.formatUnits(entranceFee)}</div>
          <div>Number of Players:{numPlayers}</div>
          <div>Recent Winner:{recentWinner}</div>
        </div>
      ) : (
        <div>No Raffle Address Detected</div>
      )}
    </div>
  );
}
