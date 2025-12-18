import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

const { wallets } = getDefaultWallets()

export const connectors = connectorsForWallets(wallets, {
  appName: 'My Token Faucet',
  projectId: 'YOUR_PROJECT_ID', // WalletConnect Project ID (podemos dejarlo vacío o usar uno genérico para pruebas locales)
})

export const config = createConfig({
  chains: [baseSepolia], // ¡Aquí definimos que solo usamos Base Sepolia!
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors,
  ssr: true,
})