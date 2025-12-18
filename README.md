# 🚰 My Web3 Faucet & ERC-20 Token

¡Bienvenido al proyecto **My Token Faucet**! Este es un ecosistema Web3 completo que incluye un Smart Contract ERC-20, una Faucet para distribución y una dApp con estilo Matrix para interactuar en la blockchain.

Desplegado y funcionando en la red de prueba **Base Sepolia**.

![Matrix Style](https://media.giphy.com/media/A06UFEx8jxEwU/giphy.gif)

## 🚀 Características

*   **🪙 ERC-20 Token (`MTK`):** Un token estándar creado con OpenZeppelin.
*   **💧 Faucet Contract:** Un contrato inteligente que permite a los usuarios reclamar 10 MTK cada 24 horas.
*   **🖥️ Matrix dApp:** Una interfaz web React moderna con estilo terminal hacker, conectada a Base Sepolia mediante **Wagmi** y **RainbowKit**.
*   **⛓️ Base Sepolia:** Desplegado en una red L2 real de Ethereum.

## 🛠️ Tecnologías Usadas

*   **Solidity:** Lenguaje de los Smart Contracts.
*   **Hardhat:** Entorno de desarrollo para compilar, probar y desplegar.
*   **React + Vite:** Frontend ultrarrápido.
*   **RainbowKit + Wagmi:** Conexión de billeteras (Wallet Connect).
*   **TypeScript:** Tipado estático para un código robusto.
*   **UnoCSS:** Estilos atómicos para el diseño Matrix.

## 📦 Instalación y Uso

Si quieres clonar este proyecto y correrlo en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/tododecripto/-web3-faucet-demo.git
cd -web3-faucet-demo
```

### 2. Instalar dependencias
Este proyecto tiene dos partes: el backend (Hardhat) y el frontend (React).

**Raíz (Hardhat):**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configuración (.env)
Crea un archivo `.env` en la raíz del proyecto (basado en el ejemplo) y añade tu clave privada y URL de RPC si planeas desplegar tus propios contratos.
*Nota: Nunca subas tu clave privada a GitHub.*

### 4. Ejecutar la dApp (Frontend)
```bash
cd frontend
npm run dev
```
Abre `http://localhost:5173` en tu navegador y conecta tu MetaMask a **Base Sepolia**.

## 📜 Comandos Útiles (Hardhat)

*   `npx hardhat compile`: Compila los contratos.
*   `npx hardhat test`: Ejecuta los tests unitarios.
*   `npx hardhat run scripts/deploy.ts --network base_sepolia`: Despliega el token.

---

Desarrollado con 💻 y ☕ por **El Profesor Cripto**.
