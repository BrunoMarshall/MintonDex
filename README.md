# MintonDex 🌊

**Official Decentralized Exchange on Shardeum Mainnet**

A fully open-source, automated market maker (AMM) DEX built on Shardeum Mainnet. MintonDex enables permissionless token swaps and liquidity provision with a familiar Uniswap-style interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/Website-mintondex.com-blue)](https://mintondex.com)
[![Mainnet](https://img.shields.io/badge/Network-Shardeum%20Mainnet-green)](https://shardeum.org)

---

## 🔒 Security & Transparency

**MintonDex is 100% open source and auditable.**

- ✅ All code is publicly available on GitHub
- ✅ Based on battle-tested Uniswap V2 protocol (billions in TVL)
- ✅ Smart contracts verified on Shardeum Explorer
- ✅ No hidden fees or malicious code
- ✅ Standard AMM implementation with proven security model
- ✅ Uses Solidity 0.8.20+ built-in overflow protection

### ⚠️ Important Safety Notice
- Always verify you're on the official domain: **mintondex.com**
- Never share your private keys or seed phrase with anyone
- Always verify contract addresses before interacting
- Start with small amounts to test functionality
- DYOR (Do Your Own Research) before using any DeFi protocol

### 🛡️ Security Status
- **Codebase**: Fork of Uniswap V2 (audited by Trail of Bits, ConsenSys Diligence)
- **Standard**: Implements industry-standard AMM x*y=k formula
- **Formal Audit**: Not formally audited - use at your own risk
- **Battle-Tested**: Core logic proven with $billions in TVL across EVM chains

---

## 🌐 Deployed Contracts

**Shardeum Mainnet (Chain ID: 8118)**

| Contract | Address | Explorer |
|----------|---------|----------|
| **MintonFactory** | `0x13B94479b80bcC600B46A14BEbCE378DA16210d6` | [View on Explorer](https://explorer.shardeum.org/address/0x13B94479b80bcC600B46A14BEbCE378DA16210d6) |
| **MintonRouter** | `0x9988864cb024f0a647c205dbbf96535b0072f40b` | [View on Explorer](https://explorer.shardeum.org/address/0x9988864cb024f0a647c205dbbf96535b0072f40b) |
| **WSHM** | `0x73653a3fb19e2b8ac5f88f1603eeb7ba164cfbeb` | [View on Explorer](https://explorer.shardeum.org/address/0x73653a3fb19e2b8ac5f88f1603eeb7ba164cfbeb) |

*All contracts are verified and open-source. Based on Uniswap V2 protocol.*

---

## ✨ Features

- 🔄 **Token Swapping** - Instant token exchanges with automated pricing (AMM)
- 💧 **Liquidity Pools** - Provide liquidity and earn 0.3% fees on all trades
- 📊 **Pool Management** - Add/remove liquidity with real-time pool data
- 🎯 **Wrap/Unwrap SHM** - Convert between native SHM and WSHM (ERC-20)
- 🎨 **Clean UI** - Intuitive interface inspired by Uniswap
- 🔗 **Open Token List** - Support for any ERC-20 token on Shardeum
- ⚡ **Low Fees** - Benefit from Shardeum's scalable infrastructure

---

## 💰 Fee Structure

### Trading Fees (Per Swap)
- **Total Fee:** 0.3% of swap amount
  - **Liquidity Providers:** 0.25% (distributed proportionally)
  - **Protocol Fee:** 0.05% (if enabled, goes to protocol treasury)

### How Fees Work
1. **Liquidity Providers** earn fees automatically on every trade
2. Fees are added to the pool, increasing LP token value
3. **No withdrawal fees** - only pay gas for transactions
4. Standard AMM model (same as Uniswap V2)

---

## 🚀 Getting Started

### 1. Setup MetaMask

Add Shardeum Mainnet to MetaMask:

- **Network Name:** Shardeum
- **RPC URL:** `https://api.shardeum.org/`
- **Chain ID:** `8118`
- **Currency Symbol:** `SHM`
- **Block Explorer:** `https://explorer.shardeum.org/`

### 2. Get SHM Tokens

Purchase SHM on supported exchanges or use Shardeum faucet

### 3. Create Tokens (Optional)

Create your own ERC-20 tokens on [MintonShardeum](https://mintonshardeum.com)

### 4. Start Trading

Visit [mintondex.com](https://mintondex.com) and connect your wallet!

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Web3 Library:** Web3.js
- **Wallet Integration:** MetaMask
- **Blockchain:** Shardeum Mainnet (EVM-compatible)
- **Smart Contracts:** Solidity 0.8.20 (Uniswap V2 fork)
- **Hosting:** GitHub Pages
- **Network:** Shardeum (Dynamic State Sharding)

---

## 📂 Project Structure

```
MintonDex/
├── contracts/
│   ├── MintonFactory.sol    # Pair factory contract
│   ├── MintonRouter.sol      # Router for swaps and liquidity
│   └── WSHM.sol              # Wrapped SHM token
├── docs/
│   ├── index.html            # Swap interface
│   ├── pool.html             # Liquidity pool management
│   ├── wrap.html             # SHM wrapping interface
│   └── assets/
│       ├── css/
│       │   └── styles.css    # Styling with gradient background
│       ├── js/
│       │   ├── app.js        # Main application logic
│       │   └── web3.min.js   # Web3 library
│       └── images/           # Logos and icons
├── tokenlist.json            # Token metadata
├── DEPLOYMENT_GUIDE.md       # Deployment instructions
└── README.md                 # This file
```

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
```

**Note:** Must use a local server (not `file://`) for Web3 functionality.

---

## 🎯 How It Works

MintonDex uses the **Constant Product Market Maker (CPMM)** formula:

```
x × y = k
```

Where:
- **x** = Reserve of Token A
- **y** = Reserve of Token B  
- **k** = Constant product

This ensures:
- ✅ Prices are determined by supply/demand
- ✅ Liquidity is always available
- ✅ No order books needed
- ✅ Automated price discovery

### Example Trade
1. User wants to swap 10 Token A for Token B
2. Formula calculates output based on pool reserves
3. 0.3% fee is deducted
4. Tokens are swapped instantly
5. Pool reserves update automatically

---

## 🤝 Contributing

Contributions are welcome! This is an open-source project.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Resources

- **Website:** [mintondex.com](https://mintondex.com)
- **Token Creator:** [mintonshardeum.com](https://mintonshardeum.com)
- **Shardeum Docs:** [docs.shardeum.org](https://docs.shardeum.org)
- **Explorer:** [explorer.shardeum.org](https://explorer.shardeum.org)
- **Uniswap V2 Docs:** [docs.uniswap.org/protocol/V2](https://docs.uniswap.org/protocol/V2)

---

## ⚖️ License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🐛 Found an Issue?

Please report bugs or security concerns:

- **GitHub Issues:** [github.com/BrunoMarshall/MintonDex/issues](https://github.com/BrunoMarshall/MintonDex/issues)
- **Security Vulnerabilities:** Contact privately via GitHub

---

## 📞 Community & Support

- **Discord:** [Shardeum Community](https://discord.com/invite/shardeum)
- **Twitter:** [@shardeum](https://twitter.com/shardeum)
- **GitHub:** [BrunoMarshall/MintonDex](https://github.com/BrunoMarshall/MintonDex)

---

## 🙏 Acknowledgments

- Built on **Shardeum** - Dynamic state sharding blockchain
- Inspired by **Uniswap V2** protocol design
- Uses **Web3.js** for Ethereum interaction
- Based on battle-tested AMM mathematics

---

## ⚠️ Disclaimer

**USE AT YOUR OWN RISK**

MintonDex is provided "as is" without warranty of any kind. The developers are not responsible for any losses incurred through the use of this platform. Always:

- ✅ DYOR (Do Your Own Research)
- ✅ Start with small amounts
- ✅ Understand DeFi risks
- ✅ Never invest more than you can afford to lose
- ✅ Verify all contract addresses
- ✅ Be aware of impermanent loss when providing liquidity

**Smart Contract Risks:**
- Contracts are not formally audited
- Based on Uniswap V2 (audited) but with custom modifications
- No guarantees of bug-free operation
- Use at your own risk

---

**Built with ❤️ for the Shardeum community**

---

## 📈 Roadmap

- [x] Deploy to Shardeum Mainnet
- [ ] Add more token pairs
- [ ] Implement advanced trading features
- [ ] Add analytics dashboard
- [ ] Mobile app development
- [ ] Governance token launch
- [ ] Professional security audit
- [ ] Partnership with Shardeum ecosystem projects

---

**🌊 Trade safely and efficiently on MintonDex!**
