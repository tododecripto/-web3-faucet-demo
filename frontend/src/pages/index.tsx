import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { withLayout } from '../layout'

// 1. Definimos la direccion de la Faucet y el ABI
const FAUCET_ADDRESS = '0x1B341D6Fd633d3046D93f7eF49DbCD2EBD894E7D'
const FAUCET_ABI = [
  {
    "inputs": [],
    "name": "requestTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

function Page() {
  const { isConnected, address } = useAccount()
  const { data: hash, writeContract, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const handleRequestTokens = () => {
    writeContract({
      address: FAUCET_ADDRESS,
      abi: FAUCET_ABI,
      functionName: 'requestTokens',
    })
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 selection:bg-green-500 selection:text-black">
      {/* Efecto de linea de escaneo o decoracion */}
      <div className="fixed top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_#22c55e]"></div>

      <div className="max-w-2xl w-full flex flex-col items-center gap-8 z-10">
        
        {/* Header Tipo Terminal */}
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">📟</div>
          <h1 className="text-5xl font-bold tracking-tighter drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
            SYSTEM_OVERRIDE:<br/>MY_TOKEN_FAUCET
          </h1>
          <p className="text-xl opacity-80 border-b border-green-900 pb-4">
            &gt; Conectando a Base Sepolia Node...<br/>
            &gt; Esperando input del usuario...
          </p>
        </div>
        
        {/* Contenedor del boton de wallet */}
        <div className="border border-green-800 p-2 rounded bg-black">
          <ConnectButton showBalance={false} />
        </div>

        {isConnected && (
          <div className="w-full mt-4 p-8 border-2 border-green-500 rounded-none bg-black shadow-[0_0_20px_rgba(34,197,94,0.2)] relative overflow-hidden group">
            
            {/* Decoracion de esquinas */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400"></div>

            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">&gt; IDENTITY_VERIFIED</h2>
                <p className="text-xs text-green-700 break-all border border-green-900 p-2 bg-green-900/10">
                  USER: {address}
                </p>
              </div>
              
              <button 
                disabled={isPending || isConfirming}
                className={`
                  relative px-8 py-4 text-xl font-bold uppercase tracking-widest border-2 transition-all duration-300
                  ${isPending || isConfirming 
                    ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                    : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black hover:shadow-[0_0_30px_#22c55e]'
                  }
                `}
                onClick={handleRequestTokens}
              >
                {isPending ? '[ EXECUTING... ]' : isConfirming ? '[ CONFIRMING... ]' : '[ INITIATE_TRANSFER ]'}
              </button>

              {isConfirmed && (
                <div className="w-full text-center p-4 bg-green-500/20 border border-green-500 text-green-400 animate-bounce">
                  &gt; SUCCESS: TOKENS_DEPLOYED_TO_WALLET
                </div>
              )}

              {error && (
                <div className="w-full text-center p-4 bg-red-900/20 border border-red-500 text-red-500">
                  &gt; ERROR: {error.message.includes('wait 24 hours') ? 'COOLDOWN_ACTIVE_WAIT_24H' : 'SYSTEM_FAILURE'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-4 text-xs text-green-900">
        v1.0.0 // PROTOCOL_SECURE
      </footer>
    </div>
  )
}

export default withLayout(Page)
