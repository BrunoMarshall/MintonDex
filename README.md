# MintonDex 🌊

**Official Decentralized Exchange on Shardeum Blockchain**

A fully open-source, automated market maker (AMM) DEX built on Shardeum EVM Testnet. MintonDex enables permissionless token swaps and liquidity provision with a familiar Uniswap-style interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/Website-mintondex.com-blue)](https://mintondex.com)
[![Testnet](https://img.shields.io/badge/Network-Shardeum%20Testnet-green)](https://shardeum.org)

---

## 🔒 Security & Transparency

**MintonDex is 100% open source and auditable.**

- ✅ All code is publicly available on GitHub
- ✅ Smart contracts are verified on Shardeum Explorer
- ✅ No hidden fees or malicious code
- ✅ Educational testnet project
- ✅ Standard Web3/MetaMask integration (like Uniswap)

### ⚠️ Important Safety Notice
- This is a **TESTNET** application for educational purposes
- Use only **test tokens** (no real value)
- Always verify you're on the official domain: **mintondex.com**
- Never share your private keys or seed phrase with anyone
- Always verify contract addresses before interacting

---

## 🌐 Deployed Contracts

**Shardeum EVM Testnet (Chain ID: 8119)**

| Contract | Address | Explorer |
|----------|---------|----------|
| **MintonFactory** | `0x1b5737e10f67bb6ac6355c35391cbab1a55ce98e` | [View on Explorer](https://explorer-mezame.shardeum.org/address/0x1b5737e10f67bb6ac6355c35391cbab1a55ce98e) |
| **MintonRouter** | `0xc23ae3a1e9bfa54e43e18487f4c68cc7916987d1` | [View on Explorer](https://explorer-mezame.shardeum.org/address/0xc23ae3a1e9bfa54e43e18487f4c68cc7916987d1) |
| **WSHM** | `0x9988864cb024f0a647c205dbbf96535b0072f40b` | [View on Explorer](https://explorer-mezame.shardeum.org/address/0x9988864cb024f0a647c205dbbf96535b0072f40b) |

All contracts are based on the battle-tested Uniswap V2 protocol.

---

## ✨ Features

- 🔄 **Token Swapping** - Instant token exchanges with automated pricing
- 💧 **Liquidity Pools** - Provide liquidity and earn 0.3% fees on all trades
- 📊 **Pool Management** - Add/remove liquidity with real-time pool data
- 🎯 **Wrap/Unwrap SHM** - Convert between native SHM and WSHM (ERC-20)
- 🎨 **Clean UI** - Intuitive interface inspired by Uniswap
- 🔗 **Open Token List** - Support for any ERC-20 token on Shardeum

---

## 💰 Fee Structure

- **Trading Fee:** 0.3% per swap
  - 100% distributed to liquidity providers proportionally
  - Standard AMM fee model (same as Uniswap V2)

---

## 🚀 Getting Started

### 1. Setup MetaMask

Add Shardeum Testnet to MetaMask:

- **Network Name:** Shardeum EVM Testnet
- **RPC URL:** `https://api-mezame.shardeum.org/`
- **Chain ID:** `8119`
- **Currency Symbol:** `SHM`
- **Block Explorer:** `https://explorer-mezame.shardeum.org/`

### 2. Get Testnet SHM

Request testnet SHM from the [Shardeum Faucet](https://faucet-mezame.shardeum.org/)

### 3. Create Tokens (Optional)

Create your own ERC-20 tokens on [MintonShardeum](https://mintonshardeum.com)

### 4. Start Trading

Visit [mintondex.com](https://mintondex.com) and connect your wallet!

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Web3 Library:** Web3.js
- **Wallet:** MetaMask integration
- **Blockchain:** Shardeum EVM (Ethereum-compatible)
- **Smart Contracts:** Solidity (Uniswap V2 fork)
- **Hosting:** GitHub Pages

---

## 📂 Project Structure
MintonDex/
├── index.html          # Swap interface
├── pool.html           # Liquidity pool management
├── wrap.html           # SHM wrapping interface
├── assets/
│   ├── css/
│   │   └── styles.css  # Styling
│   ├── js/
│   │   ├── app.js      # Main application logic
│   │   └── web3.min.js # Web3 library
│   └── images/         # Logos and icons
└── tokenlist.json      # Token metadata

---

## 🔧 Local Development
```bash
# Clone the repository
git clone https://github.com/BrunoMarshall/MintonDex.git
cd MintonDex

# Open with a local server (required for Web3)
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Visit http://localhost:8000
Note: Must use a local server (not file://) for Web3 functionality.

🎯 How It Works
MintonDex uses the Constant Product Market Maker (CPMM) formula:
x * y = k
Where:

x = Reserve of Token A
y = Reserve of Token B
k = Constant product

This ensures:

Prices are determined by supply/demand
Liquidity is always available
No order books needed


## 🤝 Contributing
Contributions are welcome! This is an educational project.

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request


## 📚 Resources

Website: mintondex.com
Token Creator: mintonshardeum.com
Shardeum Docs: docs.shardeum.org
Shardeum Explorer: explorer-mezame.shardeum.org
Uniswap V2 Docs: docs.uniswap.org/protocol/V2


## ⚖️ License
MIT License - see LICENSE file for details

## 🐛 Found an Issue?
Please report bugs or security concerns:

Open an issue on GitHub Issues
For security vulnerabilities, contact privately via GitHub


## 📞 Community & Support

Discord: Shardeum Community
Twitter: @shardeum
GitHub: BrunoMarshall/MintonDex


## 🙏 Acknowledgments

Built on Shardeum - Dynamic state sharding blockchain
Inspired by Uniswap V2 protocol design
Uses Web3.js for Ethereum interaction


## ⚠️ Disclaimer
FOR EDUCATIONAL PURPOSES ONLY
This is a testnet application with NO real monetary value. Tokens traded on MintonDex are test tokens only. The developers assume no responsibility for any losses. Always DYOR (Do Your Own Research) and never invest more than you can afford to lose.

Built with ❤️ for the Shardeum community


