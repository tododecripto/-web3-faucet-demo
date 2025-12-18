import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { withLayout } from '../layout'

// DIRECCIONES
const TOKEN_ADDRESS = '0x0EBa516262dC64647608cFCB7Cddb6afA77ab974'
const FAUCET_ADDRESS = '0x1B341D6Fd633d3046D93f7eF49DbCD2EBD894E7D'
const VENDOR_ADDRESS = '0xceF16FA8CAAc0224ae5858855f30043C8F1D32fC'
const STAKING_ADDRESS = '0xF01B08a1B8d1c60f47A21cbA9b55A282736Ee518'

// ABIs
const FAUCET_ABI = [{ "inputs": [], "name": "requestTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]
const VENDOR_ABI = [{ "inputs": [], "name": "buyTokens", "outputs": [], "stateMutability": "payable", "type": "function" }]
const TOKEN_ABI = [{ "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]
const STAKING_ABI = [
  { "inputs": [{ "name": "amount", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "name": "account", "type": "address" }], "name": "stakes", "outputs": [{ "name": "amount", "type": "uint256" }, { "name": "startTime", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "name": "account", "type": "address" }], "name": "calculateReward", "outputs": [{ "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
]

function Page() {
  const { isConnected, address } = useAccount()
  const [stakeAmount, setStakeAmount] = useState('100')
  const [buyAmount, setBuyAmount] = useState('0.001')
  const [reward, setReward] = useState('0')

  // CONTRACT WRITES
  const { writeContract: writeFaucet, isPending: isFaucetLoading } = useWriteContract()
  const { writeContract: writeVendor, isPending: isVendorLoading } = useWriteContract()
  const { writeContract: writeApprove, isPending: isApproveLoading } = useWriteContract()
  const { writeContract: writeStake, isPending: isStakeLoading } = useWriteContract()
  const { writeContract: writeWithdraw, isPending: isWithdrawLoading } = useWriteContract()

  // CONTRACT READS
  const { data: stakeData, refetch: refetchStake } = useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'stakes',
    args: [address],
  })

  const { data: rewardData, refetch: refetchReward } = useReadContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: 'calculateReward',
    args: [address],
  })

  // Refrescar recompensas cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refetchReward()
      refetchStake()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const stakedAmount = stakeData ? formatEther(stakeData[0]) : '0'
  const currentReward = rewardData ? formatEther(rewardData) : '0'

  return (
    <div className="min-h-screen bg-[#050505] text-green-400 font-mono flex flex-col items-center p-8 selection:bg-green-500 selection:text-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-900 rounded-full blur-[120px]"></div>
      </div>

      <main className="max-w-6xl w-full z-10 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-green-900/50 pb-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">MTK_FINANCE_OS</h1>
            <p className="text-green-700 mt-2 font-bold uppercase tracking-widest text-xs">&gt; STATUS: ONLINE</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-green-500/30 p-2 rounded-xl">
            <ConnectButton showBalance={true} />
          </div>
        </div>

        {isConnected ? (
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* 1. FAUCET */}
            <section className="bg-white/5 backdrop-blur-xl border border-green-500/20 p-6 rounded-3xl shadow-2xl relative group">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><span className="w-2 h-6 bg-green-500 rounded-full"></span>FAUCET</h2>
              <button 
                disabled={isFaucetLoading}
                onClick={() => writeFaucet({ address: FAUCET_ADDRESS, abi: FAUCET_ABI, functionName: 'requestTokens' })}
                className="w-full py-3 rounded-xl bg-green-500 text-black font-black uppercase hover:bg-green-400 transition-all disabled:opacity-50"
              >
                {isFaucetLoading ? 'PROCESANDO...' : 'RECLAMAR 10 MTK'}
              </button>
            </section>

            {/* 2. VENDOR */}
            <section className="bg-white/5 backdrop-blur-xl border border-emerald-500/20 p-6 rounded-3xl shadow-2xl relative group">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-emerald-400"><span className="w-2 h-6 bg-emerald-500 rounded-full"></span>TIENDA</h2>
              <div className="space-y-4">
                <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} className="w-full bg-black/60 border border-emerald-900 rounded-xl p-3 text-emerald-300 font-bold" />
                <button 
                  disabled={isVendorLoading}
                  onClick={() => writeVendor({ address: VENDOR_ADDRESS, abi: VENDOR_ABI, functionName: 'buyTokens', value: parseEther(buyAmount) })}
                  className="w-full py-3 rounded-xl border-2 border-emerald-500 text-emerald-500 font-black uppercase hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50"
                >
                  {isVendorLoading ? 'COMPRANDO...' : 'COMPRAR MTK'}
                </button>
              </div>
            </section>

            {/* 3. STAKING (EL BANCO) */}
            <section className="bg-white/5 backdrop-blur-xl border border-blue-500/20 p-6 rounded-3xl shadow-2xl relative group md:col-span-1 border-t-4 border-t-blue-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-400"><span className="w-2 h-6 bg-blue-500 rounded-full"></span>BANCO STAKING</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/40 p-3 rounded-xl border border-blue-900/50">
                  <p className="text-[10px] text-blue-600 font-bold">TU INVERSION</p>
                  <p className="text-xl font-bold text-blue-300">{Number(stakedAmount).toFixed(2)} MTK</p>
                </div>
                <div className="bg-blue-900/20 p-3 rounded-xl border border-blue-500/50 animate-pulse">
                  <p className="text-[10px] text-blue-400 font-bold">GANANCIA (VIVO)</p>
                  <p className="text-xl font-bold text-white">+{Number(currentReward).toFixed(4)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="w-full bg-black/60 border border-blue-900 rounded-xl p-3 text-blue-300 font-bold" />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    disabled={isApproveLoading}
                    onClick={() => writeApprove({ address: TOKEN_ADDRESS, abi: TOKEN_ABI, functionName: 'approve', args: [STAKING_ADDRESS, parseEther(stakeAmount)] })}
                    className="py-3 rounded-xl border border-blue-600 text-blue-500 font-bold text-xs uppercase hover:bg-blue-900/30"
                  >
                    1. APROBAR
                  </button>
                  <button 
                    disabled={isStakeLoading}
                    onClick={() => writeStake({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'stake', args: [parseEther(stakeAmount)] })}
                    className="py-3 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase hover:bg-blue-500"
                  >
                    2. DEPOSITAR
                  </button>
                </div>

                <button 
                  disabled={isWithdrawLoading}
                  onClick={() => writeWithdraw({ address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'withdraw' })}
                  className="w-full py-3 rounded-xl bg-red-900/50 text-red-400 border border-red-800 font-bold text-xs uppercase hover:bg-red-900 hover:text-white mt-4"
                >
                  RETIRAR CAPITAL + GANANCIAS
                </button>
              </div>
            </section>

          </div>
        ) : (
          <div className="text-center py-20"><h3 className="text-3xl font-bold italic text-gray-500">CONECTA TU WALLET</h3></div>
        )}
      </main>
    </div>
  )
}

export default withLayout(Page)
