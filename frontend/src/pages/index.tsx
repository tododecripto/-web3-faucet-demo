import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { withLayout } from '../layout'

// CONFIGURACION DE DIRECCIONES
const TOKEN_ADDRESS = '0x0EBa516262dC64647608cFCB7Cddb6afA77ab974'
const FAUCET_ADDRESS = '0x1B341D6Fd633d3046D93f7eF49DbCD2EBD894E7D'
const VENDOR_ADDRESS = '0xceF16FA8CAAc0224ae5858855f30043C8F1D32fC'

// ABIs SIMPLIFICADOS
const FAUCET_ABI = [{ "inputs": [], "name": "requestTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const VENDOR_ABI = [{ "inputs": [], "name": "buyTokens", "outputs": [], "stateMutability": "payable", "type": "function" }]

function Page() {
  const { isConnected, address } = useAccount()
  const [buyAmount, setBuyAmount] = useState('0.001')
  
  // Logica de Faucet
  const faucet = useWriteContract()
  const { isLoading: isFaucetConfirming, isSuccess: isFaucetSuccess } = useWaitForTransactionReceipt({ hash: faucet.data })

  // Logica de Tiendita (Vendor)
  const vendor = useWriteContract()
  const { isLoading: isVendorConfirming, isSuccess: isVendorSuccess } = useWaitForTransactionReceipt({ hash: vendor.data })

  const handleFaucet = () => {
    faucet.writeContract({ address: FAUCET_ADDRESS, abi: FAUCET_ABI, functionName: 'requestTokens' })
  }

  const handleBuy = () => {
    if (!buyAmount || isNaN(Number(buyAmount))) return
    vendor.writeContract({
      address: VENDOR_ADDRESS,
      abi: VENDOR_ABI,
      functionName: 'buyTokens',
      value: parseEther(buyAmount)
    })
  }

  return (
    <div className="min-h-screen bg-[#050505] text-green-400 font-mono flex flex-col items-center p-8 selection:bg-green-500 selection:text-black">
      {/* Background Decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-900 rounded-full blur-[120px]"></div>
      </div>

      <main className="max-w-5xl w-full z-10 space-y-12">
        
        {/* Header Pro */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-green-900/50 pb-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              MTK_CORE_OS v2.0
            </h1>
            <p className="text-green-700 mt-2 font-bold uppercase tracking-widest text-xs">
              &gt; STATUS: SECURE_CONNECTION_ESTABLISHED
            </p>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-green-500/30 p-2 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <ConnectButton showBalance={true} />
          </div>
        </div>

        {isConnected ? (
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* CARD 1: FAUCET (GIVEAWAY) */}
            <section className="bg-white/5 backdrop-blur-xl border border-green-500/20 p-8 rounded-3xl shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🚰</div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                RECURSOS_GRATIS
              </h2>
              <p className="text-green-700 mb-8 leading-relaxed">
                Acceso de emergencia a liquidez. Reclama tokens MTK de prueba para tus operaciones iniciales en la red Base.
              </p>
              
              <div className="space-y-4">
                <div className="bg-black/40 border border-green-900 p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-xs text-green-800">CANTIDAD DISPONIBLE:</span>
                  <span className="font-bold text-xl text-green-300">10.00 MTK</span>
                </div>
                
                <button 
                  disabled={faucet.isPending || isFaucetConfirming}
                  onClick={handleFaucet}
                  className="w-full py-4 rounded-2xl bg-green-500 text-black font-black uppercase tracking-widest hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {faucet.isPending ? '[ PROCESANDO... ]' : isFaucetConfirming ? '[ VERIFICANDO... ]' : '[ EJECUTAR_RECLAMO ]'}
                </button>
                {isFaucetSuccess && <p className="text-center text-xs animate-pulse mt-4">✅ TRANSFERENCIA EXITOSA</p>}
              </div>
            </section>

            {/* CARD 2: VENDOR (BUY) */}
            <section className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 p-8 rounded-3xl shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🏪</div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-emerald-400">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                ADQUISICION_MTK
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs text-emerald-800 font-bold mb-2 block">CANTIDAD A INVERTIR (ETH):</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      className="w-full bg-black/60 border border-emerald-900 rounded-2xl p-4 text-emerald-300 text-2xl font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-700 font-black">ETH</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-2xl">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-800">TIPO DE CAMBIO:</span>
                    <span>1 ETH = 100,000 MTK</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-emerald-800">RECIBIRAS:</span>
                    <span className="text-emerald-400 text-lg">{(Number(buyAmount) * 100000).toLocaleString()} MTK</span>
                  </div>
                </div>

                <button 
                  disabled={vendor.isPending || isVendorConfirming}
                  onClick={handleBuy}
                  className="w-full py-4 rounded-2xl border-2 border-emerald-500 text-emerald-500 font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50"
                >
                  {vendor.isPending ? '[ SOLICITANDO... ]' : isVendorConfirming ? '[ CONFIRMANDO... ]' : '[ COMPLETAR_ADQUISICION ]'}
                </button>
                {isVendorSuccess && <p className="text-center text-xs text-emerald-400 animate-pulse mt-4">✅ ADQUISICION COMPLETADA</p>}
              </div>
            </section>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white/5 backdrop-blur-md border border-green-900/30 rounded-[40px]">
            <div className="w-24 h-24 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-2xl font-bold italic">SISTEMA BLOQUEADO</h3>
            <p className="text-green-800 max-w-sm">Por favor, conecte su interfaz neuronal (Wallet) para acceder a los protocolos de MTK.</p>
          </div>
        )}

        {/* Footer info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] text-green-900 font-bold uppercase tracking-widest">
          <div className="p-4 border border-green-950 rounded-xl truncate">TOKEN: {TOKEN_ADDRESS}</div>
          <div className="p-4 border border-green-950 rounded-xl">NETWORK: BASE_SEPOLIA_84532</div>
          <div className="p-4 border border-green-950 rounded-xl">PROTOCOL: V2.0.4_STABLE</div>
        </div>
      </main>
    </div>
  )
}

export default withLayout(Page)