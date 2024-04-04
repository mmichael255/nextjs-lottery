import { useMoralis } from "react-moralis";

export default function ManualHeader() {
  const { enableWeb3, account } = useMoralis();
  return (
    <div>
      {account ? (
        <div>Connected!</div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
          }}
        >
          Connect
        </button>
      )}
    </div>
  );
}
