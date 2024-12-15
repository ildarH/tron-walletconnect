import UniversalProvider from "@walletconnect/universal-provider";
import { WalletConnectModal } from "@walletconnect/modal";
import { useEffect, useState } from "react";
import { TronService, TronChains } from "./utils/tronService";
import {getSignMessage, verifySignMessage} from "./api";
import { CopyButton } from './components/CopyButton'

const projectId = import.meta.env.VITE_PROJECT_ID;

const events: string[] = [];

// 1. select chains (tron)
const chains = [`tron:${TronChains.Mainnet}`];

// 2. select methods (tron)
const methods = ["tron_signMessage", "tron_signTransaction"];

// 3. create modal instance
const modal = new WalletConnectModal({
  projectId,
  chains,
});

type VerificationDetails = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  signature?: string;
  signedMessage?: string | null;
}

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);

  // 4. create State for Universal Provider and tronService
  const [provider, setProvider] = useState<UniversalProvider | null>(null);
  const [tronService, setTronService] = useState<TronService | null>(null);
  const [signMessage, setSignMessage] = useState<string | null>(null);
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationDetails>({ 
    status: 'idle' 
  });


  // 5. initialize Universal Provider onLoad
  useEffect(() => {
    async function setOnInitProvider() {
      const providerValue = await UniversalProvider.init({
        logger: "error", // log level
        projectId: projectId,
        metadata: {
          name: "WalletConnect x Tron",
          description: "Tron integration with WalletConnect's Universal Provider",
          url: "https://walletconnect.com/",
          icons: ["https://avatars.githubusercontent.com/u/37784886"],
        },
      });

      setProvider(providerValue);
    }

    setOnInitProvider();

  }, []);

  // 6. set tronService and address on setProvider
  useEffect(() => {
    if (!provider) return;

    provider.on("display_uri", async (uri: string) => {
      console.log("uri", uri);
      await modal.openModal({
        uri,
      });
    });
  }, [provider]);


  // 7. get balance when connected
  useEffect(() => {
    async function  getBalanceInit() {
      if (!tronService) return;
      const res = await tronService.getBalance(address!);

      setBalance(res!);
    }

    if (!isConnected) return;
    getBalanceInit()
    getSignMessage(address!).then((res) => {
      setSignMessage(res.message);
    });
  }, [isConnected, tronService]);

  // 8. handle connect event
  const connect = async () => {
    try {
      if (!provider) return;

      await provider.connect({
        optionalNamespaces: {
          tron: {
            methods,
            chains,
            events,
          },
        },
      });

      const tronServiceValue = new TronService(provider);
      setTronService(tronServiceValue);

      console.log("session?", provider);
      setAddress(provider.session?.namespaces.tron?.accounts[0].split(":")[2]!);

      setIsConnected(true);
    } catch {
      console.log("Something went wrong, request cancelled");
    }
    modal.closeModal();
  };

  // 9. handle disconnect event
  const disconnect = async () => {
    await provider!.disconnect();
    setIsConnected(false);
  };

  // 10. handle get Balance, signMessage and sendTransaction
  const handleSign = async () => {
    setIsSigningMessage(true);
    setVerificationResult({ status: 'idle' });
    
    try {
      const tronWeb = tronService!.getTronWeb();
      const signResult = await tronService!.signMessage(
        signMessage!,
        address!
      );

      console.log("result sign: ", signResult);

      const verifyResult = await verifySignMessage(
        address!, 
        signMessage!, 
        signResult.result
      );
      
      setVerificationResult({
        status: verifyResult.isValid ? 'success' : 'error',
        message: verifyResult.message,
        signature: signResult.result,
        signedMessage: signMessage
      });
    } catch (error) {
      console.log("error sign: ", error);
      setVerificationResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to sign message'
      });
    } finally {
      setIsSigningMessage(false);
    }
  };

  const handleGetBalance = async () => {
    const res = await tronService!.getBalance(address!);
    console.log(res);
    setBalance(res);
  };

  const handleSendTransaction = async () => {
    console.log("signing");
    const res = await tronService!.sendTransaction(address!, 100);
    console.log("result send tx: ", res);
  };

  return (
    <div className="App center-content">
      <h2>WalletConnect + TRON</h2>
      {isConnected ? (
        <>
          <p className="address-info">
            <b>Address: </b>
            <span className="monospace-text">
              {address}
              <CopyButton text={address} />
            </span>
            <br />
            <b>Balance: </b>{balance}<br />
          </p>
          <div className="btn-container">
            {/* <button onClick={handleGetBalance}>Get Balance</button> */}
            <button 
              disabled={!signMessage || isSigningMessage} 
              onClick={handleSign}
            >
              {isSigningMessage ? 'Signing...' : 'Sign MSG'}
            </button>
            {/* <button onClick={handleSendTransaction}>Send Transaction</button> */}
            <button onClick={disconnect}>Disconnect</button>
          </div>
          {verificationResult.status !== 'idle' && (
            <div className={`verification-result ${verificationResult.status}`}>
              <div className="verification-message">
                {verificationResult.message}
              </div>
              {verificationResult.status === 'success' && (
                <div className="verification-details">
                  <div className="detail-item">
                    <span>Signed Message:</span>
                    <div className="code-container">
                      <code>{verificationResult.signedMessage}</code>
                      <CopyButton text={verificationResult.signedMessage || ''} />
                    </div>
                  </div>
                  <div className="detail-item">
                    <span>Signature:</span>
                    <div className="code-container">
                      <code>{verificationResult.signature}</code>
                      <CopyButton text={verificationResult.signature || ''} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </div>
  );
};

export default App;
