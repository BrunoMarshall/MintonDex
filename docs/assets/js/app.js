const web3 = new Web3(window.ethereum);

// Contract Addresses
const FACTORY_ADDRESS = "0x13B94479b80bcC600B46A14BEbCE378DA16210d6";
const ROUTER_ADDRESS = "0x9988864cb024f0a647c205dbbf96535b0072f40b";
const WSHM_ADDRESS = "0x73653a3fb19e2b8ac5f88f1603eeb7ba164cfbeb";

// Special SHM Token Object
const SHM_TOKEN = {
  address: 'NATIVE_SHM',
  name: 'Shardeum',
  symbol: 'SHM',
  decimals: 18,
  logoURI: 'https://raw.githubusercontent.com/BrunoMarshall/MintonDex/main/logos/shm.png',
  isNative: true
};

// ABIs
const FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "tokenA", "type": "address" },
      { "internalType": "address", "name": "tokenB", "type": "address" }
    ],
    "name": "createPair",
    "outputs": [{ "internalType": "address", "name": "pair", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "getPair",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "allPairsLength",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "allPairs",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeTo",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const ROUTER_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "amountTokenDesired", "type": "uint256" },
      { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" },
      { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "addLiquidityETH",
    "outputs": [
      { "internalType": "uint256", "name": "amountToken", "type": "uint256" },
      { "internalType": "uint256", "name": "amountETH", "type": "uint256" },
      { "internalType": "uint256", "name": "liquidity", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "tokenA", "type": "address" },
      { "internalType": "address", "name": "tokenB", "type": "address" },
      { "internalType": "uint256", "name": "amountADesired", "type": "uint256" },
      { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" },
      { "internalType": "uint256", "name": "amountAMin", "type": "uint256" },
      { "internalType": "uint256", "name": "amountBMin", "type": "uint256" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "addLiquidity",
    "outputs": [
      { "internalType": "uint256", "name": "amountA", "type": "uint256" },
      { "internalType": "uint256", "name": "amountB", "type": "uint256" },
      { "internalType": "uint256", "name": "liquidity", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "tokenA", "type": "address" },
      { "internalType": "address", "name": "tokenB", "type": "address" },
      { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
      { "internalType": "uint256", "name": "amountAMin", "type": "uint256" },
      { "internalType": "uint256", "name": "amountBMin", "type": "uint256" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "removeLiquidity",
    "outputs": [
      { "internalType": "uint256", "name": "amountA", "type": "uint256" },
      { "internalType": "uint256", "name": "amountB", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "token", "type": "address" },
      { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
      { "internalType": "uint256", "name": "amountTokenMin", "type": "uint256" },
      { "internalType": "uint256", "name": "amountETHMin", "type": "uint256" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "removeLiquidityETH",
    "outputs": [
      { "internalType": "uint256", "name": "amountToken", "type": "uint256" },
      { "internalType": "uint256", "name": "amountETH", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
      { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "swapExactETHForTokens",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
      { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" }
    ],
    "name": "swapExactTokensForETH",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
      { "internalType": "address[]", "name": "path", "type": "address[]" }
    ],
    "name": "getAmountsOut",
    "outputs": [{ "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "tokenA", "type": "address" },
      { "internalType": "address", "name": "tokenB", "type": "address" }
    ],
    "name": "getReserves",
    "outputs": [
      { "internalType": "uint256", "name": "reserveA", "type": "uint256" },
      { "internalType": "uint256", "name": "reserveB", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const ERC20_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];


// WSHM ABI for automatic wrapping
const WSHM_ABI = [
  {
    "constant": false,
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{ "internalType": "uint256", "name": "wad", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const PAIR_ABI = [
  {
    "inputs": [],
    "name": "token0",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token1",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReserves",
    "outputs": [
      { "internalType": "uint112", "name": "reserve0", "type": "uint112" },
      { "internalType": "uint112", "name": "reserve1", "type": "uint112" },
      { "internalType": "uint32", "name": "blockTimestampLast", "type": "uint32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" },
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract Instances
const factoryContract = new web3.eth.Contract(FACTORY_ABI, FACTORY_ADDRESS);
const routerContract = new web3.eth.Contract(ROUTER_ABI, ROUTER_ADDRESS);

// Network Configuration
const SHARDEUM_MAINNET = {
  chainId: '0x1FB6',  // 8118 in hex
  chainName: 'Shardeum',
  rpcUrls: ['https://api.shardeum.org/'],
  nativeCurrency: { name: 'SHM', symbol: 'SHM', decimals: 18 },
  blockExplorerUrls: ['https://explorer.shardeum.org/']
};

// Global State
let currentAccount = null;
let selectedTokenIn = null;
let selectedTokenOut = null;
let tokenList = [];
let currentModalCallback = null;

// DOM Elements
const connectButton = document.getElementById('connect-metamask');
const disconnectButton = document.getElementById('disconnect-metamask');
const connectionStatus = document.getElementById('connection-status');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp();
  setupEventListeners();
  await loadTokenList();
});

async function initializeApp() {
  if (window.ethereum) {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        await updateConnectionStatus();
      }
    } catch (error) {
      console.error('Error initializing:', error);
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', () => window.location.reload());
  }
}

function setupEventListeners() {
  if (connectButton) {
    connectButton.addEventListener('click', connectWallet);
  }
  if (disconnectButton) {
    disconnectButton.addEventListener('click', disconnectWallet);
  }

  const swapBtn = document.getElementById('swap-btn');
  const inputAmount = document.getElementById('input-amount');
  const selectTokenIn = document.getElementById('select-token-in');
  const selectTokenOut = document.getElementById('select-token-out');
  const swapDirection = document.getElementById('swap-direction');
  const maxBtn = document.getElementById('max-btn');

  if (swapBtn) swapBtn.addEventListener('click', executeSwap);
  if (inputAmount) inputAmount.addEventListener('input', calculateOutput);
  if (selectTokenIn) selectTokenIn.addEventListener('click', () => openTokenModal('in'));
  if (selectTokenOut) selectTokenOut.addEventListener('click', () => openTokenModal('out'));
  if (swapDirection) swapDirection.addEventListener('click', flipTokens);
  if (maxBtn) maxBtn.addEventListener('click', setMaxAmount);

  setupPoolEventListeners();

  const modal = document.getElementById('token-modal');
  const closeModal = document.querySelector('.close-modal');
  const tokenSearch = document.getElementById('token-search');

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  if (tokenSearch) {
    tokenSearch.addEventListener('input', filterTokens);
  }
}

function setupPoolEventListeners() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  const addBtn = document.getElementById('add-liquidity-btn');
  const selectAddTokenA = document.getElementById('select-add-token-a');
  const selectAddTokenB = document.getElementById('select-add-token-b');
  const addAmountA = document.getElementById('add-amount-a');
  const addAmountB = document.getElementById('add-amount-b');

  if (addBtn) addBtn.addEventListener('click', addLiquidity);
  if (selectAddTokenA) selectAddTokenA.addEventListener('click', () => openTokenModal('addA'));
  if (selectAddTokenB) selectAddTokenB.addEventListener('click', () => openTokenModal('addB'));
  if (addAmountA) addAmountA.addEventListener('input', calculateLiquidityB);
  if (addAmountB) addAmountB.addEventListener('input', calculateLiquidityA);

  const removeBtn = document.getElementById('remove-liquidity-btn');
  const removeSlider = document.getElementById('remove-slider');
  const presetBtns = document.querySelectorAll('.preset-btn');

  if (removeBtn) removeBtn.addEventListener('click', removeLiquidity);
  if (removeSlider) removeSlider.addEventListener('input', updateRemoveAmount);
  
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.value;
      if (removeSlider) {
        removeSlider.value = value;
        updateRemoveAmount();
      }
    });
  });
}

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed. Please install it to use MintonDex.');
    window.open('https://metamask.io/download/', '_blank');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];

    const chainId = await web3.eth.getChainId();
    if (Number(chainId) !== 8118) {
      await switchToShardeum();
    }

    await updateConnectionStatus();
    showStatus('Connected successfully!', 'success');
  } catch (error) {
    console.error('Connection error:', error);
    showStatus('Failed to connect wallet', 'error');
  }
}

async function disconnectWallet() {
  currentAccount = null;
  updateConnectionStatus();
  showStatus('Wallet disconnected', 'info');
}

async function switchToShardeum() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SHARDEUM_MAINNET.chainId }]
    });
  } catch (error) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SHARDEUM_MAINNET]
        });
      } catch (addError) {
        console.error('Error adding network:', addError);
      }
    }
  }
}

async function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    currentAccount = null;
  } else {
    currentAccount = accounts[0];
  }
  await updateConnectionStatus();
  window.location.reload();
}

async function updateConnectionStatus() {
  if (!currentAccount) {
    if (connectionStatus) connectionStatus.style.display = 'none';
    if (disconnectButton) disconnectButton.style.display = 'none';
    if (connectButton) {
      connectButton.style.display = 'inline-block';
      connectButton.textContent = 'Connect Wallet';
    }
    updateButtonStates();
    return;
  }

  const shortAddress = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
  
  if (connectionStatus) {
    connectionStatus.textContent = `Shardeum Mainnet | ${shortAddress}`;
    connectionStatus.style.display = 'inline';
  }
  if (disconnectButton) disconnectButton.style.display = 'inline-block';
  if (connectButton) connectButton.style.display = 'none';

  updateButtonStates();
  await updateBalances();
}

function updateButtonStates() {
  const swapBtn = document.getElementById('swap-btn');
  const addBtn = document.getElementById('add-liquidity-btn');
  const removeBtn = document.getElementById('remove-liquidity-btn');

  if (swapBtn) {
    if (!currentAccount) {
      swapBtn.textContent = 'Connect Wallet';
      swapBtn.disabled = false;
    } else if (!selectedTokenIn || !selectedTokenOut) {
      swapBtn.textContent = 'Select Tokens';
      swapBtn.disabled = true;
    } else {
      swapBtn.textContent = 'Swap';
      swapBtn.disabled = false;
    }
  }

  if (addBtn) {
    addBtn.textContent = currentAccount ? 'Add Liquidity' : 'Connect Wallet';
    addBtn.disabled = !currentAccount;
  }

  if (removeBtn) {
    removeBtn.textContent = currentAccount ? 'Remove Liquidity' : 'Connect Wallet';
    removeBtn.disabled = !currentAccount;
  }
}

async function loadTokenList() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/BrunoMarshall/MintonDex/main/tokenlist.json');
    const data = await response.json();
    tokenList = [SHM_TOKEN, ...(data.tokens || [])];
    
    if (currentAccount) {
      await updateTokenBalances();
    }
  } catch (error) {
    console.error('Error loading token list:', error);
    tokenList = [
      SHM_TOKEN,
      {
        address: WSHM_ADDRESS,
        name: 'Wrapped SHM',
        symbol: 'WSHM',
        decimals: 18,
        logoURI: 'https://raw.githubusercontent.com/BrunoMarshall/MintonDex/main/logos/wshm.png'
      }
    ];
  }
}

async function updateTokenBalances() {
  if (!currentAccount) return;
  
  for (let token of tokenList) {
    try {
      if (token.isNative) {
        const balance = await web3.eth.getBalance(currentAccount);
        token.balance = web3.utils.fromWei(balance, 'ether');
      } else {
        const tokenContract = new web3.eth.Contract(ERC20_ABI, token.address);
        const balance = await tokenContract.methods.balanceOf(currentAccount).call();
        token.balance = web3.utils.fromWei(balance, 'ether');
      }
    } catch (error) {
      console.error(`Error fetching balance for ${token.symbol}:`, error);
      token.balance = '0';
    }
  }
}

function openTokenModal(callback) {
  currentModalCallback = callback;
  const modal = document.getElementById('token-modal');
  modal.classList.add('active');
  
  const tokenSearch = document.getElementById('token-search');
  if (tokenSearch) tokenSearch.value = '';
  
  displayTokenList(tokenList);
}

function displayTokenList(tokens) {
  const tokenListEl = document.getElementById('token-list');
  if (!tokenListEl) return;

  if (tokens.length === 0) {
    tokenListEl.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #999;">
        <p>No tokens found. Paste a token address to add it.</p>
        <p style="margin-top: 10px; font-size: 0.85rem;">
          Create tokens on <a href="https://mintonshardeum.com" target="_blank" style="color: #667eea;">MintonShardeum</a>
        </p>
      </div>
    `;
    return;
  }

  tokenListEl.innerHTML = tokens.map(token => `
    <div class="token-item" onclick="selectToken('${token.address}')">
      ${token.logoURI ? `<img src="${token.logoURI}" alt="${token.symbol}" style="width: 32px; height: 32px; border-radius: 50%;" onerror="this.style.display='none'">` : '<div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>'}
      <div class="token-item-info">
        <div class="token-item-symbol">${token.symbol}</div>
        <div class="token-item-name">${token.name}</div>
      </div>
      ${token.balance ? `<div class="token-item-balance">${parseFloat(token.balance).toFixed(4)}</div>` : ''}
    </div>
  `).join('');
}

async function filterTokens() {
  const searchValue = document.getElementById('token-search').value.toLowerCase();
  
  if (web3.utils.isAddress(searchValue)) {
    try {
      const tokenInfo = await getTokenInfo(searchValue);
      if (tokenInfo) {
        displayTokenList([tokenInfo]);
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  } else {
    const filtered = tokenList.filter(token =>
      token.symbol.toLowerCase().includes(searchValue) ||
      token.name.toLowerCase().includes(searchValue) ||
      token.address.toLowerCase().includes(searchValue)
    );
    displayTokenList(filtered);
  }
}

async function getTokenInfo(address) {
  try {
    const tokenContract = new web3.eth.Contract(ERC20_ABI, address);
    const [name, symbol, decimals] = await Promise.all([
      tokenContract.methods.name().call(),
      tokenContract.methods.symbol().call(),
      tokenContract.methods.decimals().call()
    ]);

    let balance = '0';
    if (currentAccount) {
      const bal = await tokenContract.methods.balanceOf(currentAccount).call();
      balance = web3.utils.fromWei(bal, 'ether');
    }

    return { address, name, symbol, decimals: Number(decimals), balance };
  } catch (error) {
    console.error('Error getting token info:', error);
    return null;
  }
}

async function selectToken(address) {
  let tokenInfo = tokenList.find(t => t.address.toLowerCase() === address.toLowerCase());
  
  if (!tokenInfo && address !== 'NATIVE_SHM') {
    tokenInfo = await getTokenInfo(address);
    if (!tokenInfo) return;
    tokenList.push(tokenInfo);
  }

  const modal = document.getElementById('token-modal');
  modal.classList.remove('active');

  if (currentModalCallback === 'in') {
    selectedTokenIn = tokenInfo;
    document.getElementById('token-in-symbol').textContent = tokenInfo.symbol;
    document.getElementById('balance-in').textContent = `Balance: ${parseFloat(tokenInfo.balance || 0).toFixed(4)}`;
  } else if (currentModalCallback === 'out') {
    selectedTokenOut = tokenInfo;
    document.getElementById('token-out-symbol').textContent = tokenInfo.symbol;
    document.getElementById('balance-out').textContent = `Balance: ${parseFloat(tokenInfo.balance || 0).toFixed(4)}`;
  } else if (currentModalCallback === 'addA') {
    window.selectedAddTokenA = tokenInfo;
    document.getElementById('add-token-a-symbol').textContent = tokenInfo.symbol;
    document.getElementById('add-balance-a').textContent = `Balance: ${parseFloat(tokenInfo.balance || 0).toFixed(4)}`;
  } else if (currentModalCallback === 'addB') {
    window.selectedAddTokenB = tokenInfo;
    document.getElementById('add-token-b-symbol').textContent = tokenInfo.symbol;
    document.getElementById('add-balance-b').textContent = `Balance: ${parseFloat(tokenInfo.balance || 0).toFixed(4)}`;
  }

  updateButtonStates();
  calculateOutput();
}

async function calculateOutput() {
  const inputAmount = document.getElementById('input-amount');
  const outputAmount = document.getElementById('output-amount');
  const swapDetails = document.getElementById('swap-details');
  
  if (!inputAmount || !outputAmount) return;
  
  const amountIn = inputAmount.value;
  
  if (!amountIn || !selectedTokenIn || !selectedTokenOut || parseFloat(amountIn) <= 0) {
    outputAmount.value = '';
    if (swapDetails) swapDetails.style.display = 'none';
    return;
  }

  try {
    const amountInWei = web3.utils.toWei(amountIn, 'ether');
    
    let path;
    if (selectedTokenIn.isNative) {
      path = [WSHM_ADDRESS, selectedTokenOut.address];
    } else if (selectedTokenOut.isNative) {
      path = [selectedTokenIn.address, WSHM_ADDRESS];
    } else {
      path = [selectedTokenIn.address, selectedTokenOut.address];
    }
    
    // Check if pool exists first
    const pairAddress = await factoryContract.methods.getPair(path[0], path[1]).call();
    
    if (!pairAddress || pairAddress === '0x0000000000000000000000000000000000000000') {
      outputAmount.value = '';
      if (swapDetails) {
        swapDetails.innerHTML = '<div style="color: #ff6b6b; padding: 15px; text-align: center;">No liquidity pool exists for this pair. <a href="pool.html" style="color: #667eea;">Create one?</a></div>';
        swapDetails.style.display = 'block';
      }
      return;
    }
    
    const amounts = await routerContract.methods.getAmountsOut(amountInWei, path).call();
    const amountOut = web3.utils.fromWei(amounts[1], 'ether');
    
    outputAmount.value = parseFloat(amountOut).toFixed(6);
    
    const exchangeRate = parseFloat(amountOut) / parseFloat(amountIn);
    const fee = parseFloat(amountIn) * 0.003;
    const priceImpact = await calculatePriceImpact(amountInWei, amounts[1], path);
    
    document.getElementById('exchange-rate').textContent = `1 ${selectedTokenIn.symbol} = ${exchangeRate.toFixed(6)} ${selectedTokenOut.symbol}`;
    document.getElementById('price-impact').textContent = `${priceImpact.toFixed(2)}%`;
    document.getElementById('swap-fee').textContent = `${fee.toFixed(6)} ${selectedTokenIn.symbol}`;
    
    if (swapDetails) swapDetails.style.display = 'block';
  } catch (error) {
    console.log('Calculate output: Pool may not exist');
    outputAmount.value = '';
    if (swapDetails) {
      swapDetails.innerHTML = '<div style="color: #ff6b6b; padding: 15px; text-align: center;">No liquidity pool exists for this pair. <a href="pool.html" style="color: #667eea;">Create one?</a></div>';
      swapDetails.style.display = 'block';
    }
  }
}
async function calculatePriceImpact(amountIn, amountOut, path) {
  try {
    console.log("=== PRICE IMPACT CALCULATION ===");
    console.log("Amount In (wei):", amountIn);
    console.log("Amount Out (wei):", amountOut);
    console.log("Path:", path);
    
    // Get reserves from the pair contract directly for more accuracy
    const pairAddress = await factoryContract.methods.getPair(path[0], path[1]).call();
    
    if (!pairAddress || pairAddress === '0x0000000000000000000000000000000000000000') {
      console.log("No pair found");
      return 0;
    }
    
    const pairContract = new web3.eth.Contract(PAIR_ABI, pairAddress);
    const reserves = await pairContract.methods.getReserves().call();
    const token0 = await pairContract.methods.token0().call();
    
    console.log("Pair address:", pairAddress);
    console.log("Token0 from pair:", token0);
    console.log("Reserve0:", reserves.reserve0);
    console.log("Reserve1:", reserves.reserve1);
    
    // Determine which reserve is which based on token order
    let reserveIn, reserveOut;
    if (token0.toLowerCase() === path[0].toLowerCase()) {
      reserveIn = reserves.reserve0;
      reserveOut = reserves.reserve1;
    } else {
      reserveIn = reserves.reserve1;
      reserveOut = reserves.reserve0;
    }
    
    console.log("Reserve In:", reserveIn);
    console.log("Reserve Out:", reserveOut);
    
    // Calculate the ideal price (without price impact, but with 0.3% fee)
    // Formula: idealOutput = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
    const amountInWithFee = BigInt(amountIn) * BigInt(997);
    const numerator = amountInWithFee * BigInt(reserveOut);
    const denominator = BigInt(reserveIn) * BigInt(1000) + amountInWithFee;
    const idealOutput = numerator / denominator;
    
    console.log("Ideal output (with fee):", idealOutput.toString());
    console.log("Actual output:", amountOut);
    
    // Calculate price impact
    // Price impact = (idealOutput - actualOutput) / idealOutput * 100
    // But since getAmountsOut already includes the fee, they should be the same
    // The real price impact is: how much worse than the spot price we're getting
    
    // Better formula: compare to spot price before trade
    const spotPrice = (BigInt(reserveOut) * BigInt(10000)) / BigInt(reserveIn);
    const executionPrice = (BigInt(amountOut) * BigInt(10000)) / BigInt(amountIn);
    
    console.log("Spot price (scaled):", spotPrice.toString());
    console.log("Execution price (scaled):", executionPrice.toString());
    
    // Price impact = ((spotPrice - executionPrice) / spotPrice) * 100
    const priceImpactScaled = ((spotPrice - executionPrice) * BigInt(10000)) / spotPrice;
    const priceImpact = Number(priceImpactScaled) / 100;
    
    console.log("Price Impact:", priceImpact, "%");
    
    return Math.abs(priceImpact);
  } catch (error) {
    console.error("Error calculating price impact:", error);
    return 0;
  }
}

function flipTokens() {
  const temp = selectedTokenIn;
  selectedTokenIn = selectedTokenOut;
  selectedTokenOut = temp;
  
  if (selectedTokenIn) {
    document.getElementById('token-in-symbol').textContent = selectedTokenIn.symbol;
    document.getElementById('balance-in').textContent = `Balance: ${parseFloat(selectedTokenIn.balance || 0).toFixed(4)}`;
  }
  
  if (selectedTokenOut) {
    document.getElementById('token-out-symbol').textContent = selectedTokenOut.symbol;
    document.getElementById('balance-out').textContent = `Balance: ${parseFloat(selectedTokenOut.balance || 0).toFixed(4)}`;
  }
  
  const inputValue = document.getElementById('input-amount').value;
  const outputValue = document.getElementById('output-amount').value;
  
  document.getElementById('input-amount').value = outputValue;
  document.getElementById('output-amount').value = inputValue;
  
  calculateOutput();
}

async function setMaxAmount() {
  if (!selectedTokenIn || !currentAccount) return;
  
  try {
    if (selectedTokenIn.isNative) {
      const balance = await web3.eth.getBalance(currentAccount);
      const balanceInEther = web3.utils.fromWei(balance, 'ether');
      const maxAmount = Math.max(0, parseFloat(balanceInEther) - 0.1);
      document.getElementById('input-amount').value = maxAmount.toFixed(6);
    } else {
      const tokenContract = new web3.eth.Contract(ERC20_ABI, selectedTokenIn.address);
      const balance = await tokenContract.methods.balanceOf(currentAccount).call();
      const balanceInEther = web3.utils.fromWei(balance, 'ether');
      document.getElementById('input-amount').value = balanceInEther;
    }
    await calculateOutput();
  } catch (error) {
    console.error('Error setting max amount:', error);
  }
}

async function executeSwap() {
  if (!currentAccount) {
    await connectWallet();
    return;
  }
  
  if (!selectedTokenIn || !selectedTokenOut) {
    showStatus('Please select both tokens', 'error', 'status-message');
    return;
  }
  
  const amountIn = document.getElementById('input-amount').value;
  
  if (!amountIn || parseFloat(amountIn) <= 0) {
    showStatus('Please enter an amount', 'error', 'status-message');
    return;
  }
  
  try {
    showStatus('Preparing swap...', 'info', 'status-message');
    
    const amountInWei = web3.utils.toWei(amountIn, 'ether');
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    
    console.log("=== SWAP DEBUG ===");
    console.log("Amount In:", amountIn);
    console.log("Token In:", selectedTokenIn.symbol, selectedTokenIn.address);
    console.log("Token Out:", selectedTokenOut.symbol, selectedTokenOut.address);
    console.log("Is Token In Native?", selectedTokenIn.isNative);
    console.log("Is Token Out Native?", selectedTokenOut.isNative);
    
    // Case 1: Swapping SHM for tokens
    if (selectedTokenIn.isNative) {
      const path = [WSHM_ADDRESS, selectedTokenOut.address];
      console.log("Path:", path);
      
      const amounts = await routerContract.methods.getAmountsOut(amountInWei, path).call();
      const amountOutMin = (BigInt(amounts[1]) * BigInt(95)) / BigInt(100);
      
      console.log("Expected output:", web3.utils.fromWei(amounts[1], 'ether'));
      console.log("Min output (5% slippage):", web3.utils.fromWei(amountOutMin.toString(), 'ether'));
      
      showStatus('Swapping SHM for tokens...', 'info', 'status-message');
      
      const tx = await routerContract.methods.swapExactETHForTokens(
        amountOutMin.toString(),
        path,
        currentAccount,
        deadline
      ).send({
        from: currentAccount,
        value: amountInWei,
        gas: 300000
      });
      
      console.log("Swap successful:", tx.transactionHash);
      showStatus(`Swap successful! 🎉 <a href="https://explorer.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Transaction</a>`, 'success', 'status-message');
    }
    // Case 2: Swapping tokens for SHM
    else if (selectedTokenOut.isNative) {
      const path = [selectedTokenIn.address, WSHM_ADDRESS];
      console.log("Path:", path);
      
      const amounts = await routerContract.methods.getAmountsOut(amountInWei, path).call();
      const amountOutMin = (BigInt(amounts[1]) * BigInt(95)) / BigInt(100);
      
      console.log("Expected output:", web3.utils.fromWei(amounts[1], 'ether'));
      console.log("Min output (5% slippage):", web3.utils.fromWei(amountOutMin.toString(), 'ether'));
      
      const tokenContract = new web3.eth.Contract(ERC20_ABI, selectedTokenIn.address);
      const allowance = await tokenContract.methods.allowance(currentAccount, ROUTER_ADDRESS).call();
      
      console.log("Current allowance:", web3.utils.fromWei(allowance, 'ether'));
      
      if (BigInt(allowance) < BigInt(amountInWei)) {
        showStatus('Approving token...', 'info', 'status-message');
        const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
        
        await tokenContract.methods.approve(ROUTER_ADDRESS, MAX_UINT256).send({
          from: currentAccount,
          gas: 100000
        });
        
        console.log("Token approved");
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      showStatus('Swapping tokens for SHM...', 'info', 'status-message');
      
      const tx = await routerContract.methods.swapExactTokensForETH(
        amountInWei,
        amountOutMin.toString(),
        path,
        currentAccount,
        deadline
      ).send({
        from: currentAccount,
        gas: 300000
      });
      
      console.log("Swap successful:", tx.transactionHash);
      showStatus(`Swap successful! 🎉 <a href="https://explorer.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Transaction</a>`, 'success', 'status-message');
    }
    // Case 3: Swapping tokens for tokens
    else {
      const path = [selectedTokenIn.address, selectedTokenOut.address];
      console.log("Path:", path);
      
      const amounts = await routerContract.methods.getAmountsOut(amountInWei, path).call();
      const amountOutMin = (BigInt(amounts[1]) * BigInt(95)) / BigInt(100);
      
      console.log("Expected output:", web3.utils.fromWei(amounts[1], 'ether'));
      console.log("Min output (5% slippage):", web3.utils.fromWei(amountOutMin.toString(), 'ether'));
      
      const tokenContract = new web3.eth.Contract(ERC20_ABI, selectedTokenIn.address);
      const allowance = await tokenContract.methods.allowance(currentAccount, ROUTER_ADDRESS).call();
      
      console.log("Current allowance:", web3.utils.fromWei(allowance, 'ether'));
      
      if (BigInt(allowance) < BigInt(amountInWei)) {
        showStatus('Approving token...', 'info', 'status-message');
        const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
        
        await tokenContract.methods.approve(ROUTER_ADDRESS, MAX_UINT256).send({
          from: currentAccount,
          gas: 100000
        });
        
        console.log("Token approved");
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      showStatus('Swapping tokens...', 'info', 'status-message');
      
      const tx = await routerContract.methods.swapExactTokensForTokens(
        amountInWei,
        amountOutMin.toString(),
        path,
        currentAccount,
        deadline
      ).send({
        from: currentAccount,
        gas: 300000
      });
      
      console.log("Swap successful:", tx.transactionHash);
      showStatus(`Swap successful! 🎉 <a href="https://explorer.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Transaction</a>`, 'success', 'status-message');
    }
    
    document.getElementById('input-amount').value = '';
    document.getElementById('output-amount').value = '';
    await updateBalances();
    
  } catch (error) {
    console.error('Swap error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    let errorMsg = 'Swap failed';
    
    if (error.message) {
      if (error.message.includes('insufficient funds')) {
        errorMsg = 'Insufficient funds for gas fees';
      } else if (error.message.includes('user rejected') || error.message.includes('User denied')) {
        errorMsg = 'Transaction cancelled by user';
      } else if (error.message.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
        errorMsg = 'Insufficient output amount. Try increasing slippage or reducing input amount.';
      } else if (error.message.includes('INSUFFICIENT_LIQUIDITY')) {
        errorMsg = 'Insufficient liquidity for this trade';
      } else if (error.message.includes('EXPIRED')) {
        errorMsg = 'Transaction expired. Please try again.';
      } else if (error.message.includes('execution reverted')) {
        errorMsg = 'Transaction reverted. Check token approvals and pool liquidity.';
      } else {
        errorMsg = `Error: ${error.message.substring(0, 150)}`;
      }
    }
    
    showStatus(errorMsg, 'error', 'status-message');
  }
}

async function calculateLiquidityB() {
  const amountA = document.getElementById('add-amount-a')?.value;
  const amountB = document.getElementById('add-amount-b');
  
  if (!amountA || !window.selectedAddTokenA || !window.selectedAddTokenB || parseFloat(amountA) <= 0) {
    if (amountB) amountB.value = '';
    return;
  }
  
  try {
    // Convert NATIVE_SHM to WSHM_ADDRESS for getReserves call
    const tokenAAddress = window.selectedAddTokenA.address === 'NATIVE_SHM' ? WSHM_ADDRESS : window.selectedAddTokenA.address;
    const tokenBAddress = window.selectedAddTokenB.address === 'NATIVE_SHM' ? WSHM_ADDRESS : window.selectedAddTokenB.address;
    
    // Check if pair exists first
    const pairAddress = await factoryContract.methods.getPair(tokenAAddress, tokenBAddress).call();
    
    // If no pair exists (address is 0x0), skip calculation - this will be a new pool
    if (!pairAddress || pairAddress === '0x0000000000000000000000000000000000000000') {
      console.log('No existing pool - user can set initial ratio');
      return;
    }
    
    const reserves = await routerContract.methods.getReserves(
      tokenAAddress,
      tokenBAddress
    ).call();
    
    if (reserves.reserveA === '0' || reserves.reserveB === '0') {
      return;
    }
    
    const amountAWei = web3.utils.toWei(amountA, 'ether');
    const optimalB = (BigInt(amountAWei) * BigInt(reserves.reserveB)) / BigInt(reserves.reserveA);
    
    if (amountB) {
      amountB.value = web3.utils.fromWei(optimalB.toString(), 'ether');
    }
  } catch (error) {
    console.log('Calculate liquidity B: Pool may not exist yet');
    // Silently fail - this is normal for new pools
  }
}

async function calculateLiquidityA() {
  const amountB = document.getElementById('add-amount-b')?.value;
  const amountA = document.getElementById('add-amount-a');
  
  if (!amountB || !window.selectedAddTokenA || !window.selectedAddTokenB || parseFloat(amountB) <= 0) {
    if (amountA) amountA.value = '';
    return;
  }
  
  try {
    // Convert NATIVE_SHM to WSHM_ADDRESS for getReserves call
    const tokenAAddress = window.selectedAddTokenA.address === 'NATIVE_SHM' ? WSHM_ADDRESS : window.selectedAddTokenA.address;
    const tokenBAddress = window.selectedAddTokenB.address === 'NATIVE_SHM' ? WSHM_ADDRESS : window.selectedAddTokenB.address;
    
    // Check if pair exists first
    const pairAddress = await factoryContract.methods.getPair(tokenAAddress, tokenBAddress).call();
    
    // If no pair exists (address is 0x0), skip calculation - this will be a new pool
    if (!pairAddress || pairAddress === '0x0000000000000000000000000000000000000000') {
      console.log('No existing pool - user can set initial ratio');
      return;
    }
    
    const reserves = await routerContract.methods.getReserves(
      tokenAAddress,
      tokenBAddress
    ).call();
    
    if (reserves.reserveA === '0' || reserves.reserveB === '0') {
      return;
    }
    
    const amountBWei = web3.utils.toWei(amountB, 'ether');
    const optimalA = (BigInt(amountBWei) * BigInt(reserves.reserveA)) / BigInt(reserves.reserveB);
    
    if (amountA) {
      amountA.value = web3.utils.fromWei(optimalA.toString(), 'ether');
    }
  } catch (error) {
    console.log('Calculate liquidity A: Pool may not exist yet');
    // Silently fail - this is normal for new pools
  }
}

async function addLiquidity() {
  if (!currentAccount) {
    await connectWallet();
    return;
  }
  
  if (!window.selectedAddTokenA || !window.selectedAddTokenB) {
    showStatus('Please select both tokens', 'error', 'add-status');
    return;
  }
  
  const amountA = document.getElementById('add-amount-a').value;
  const amountB = document.getElementById('add-amount-b').value;
  
  if (!amountA || !amountB || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
    showStatus('Please enter valid amounts', 'error', 'add-status');
    return;
  }
  
  try {
    const amountAWei = web3.utils.toWei(amountA, 'ether');
    const amountBWei = web3.utils.toWei(amountB, 'ether');
    
    // Check if either token is native SHM
    const isTokenANative = window.selectedAddTokenA.address === 'NATIVE_SHM';
    const isTokenBNative = window.selectedAddTokenB.address === 'NATIVE_SHM';
    
    // Handle liquidity with native SHM (automatic wrapping by router)
    if (isTokenANative || isTokenBNative) {
      const tokenAddress = isTokenANative ? window.selectedAddTokenB.address : window.selectedAddTokenA.address;
      const tokenAmount = isTokenANative ? amountBWei : amountAWei;
      const ethAmount = isTokenANative ? amountAWei : amountBWei;
      const tokenSymbol = isTokenANative ? window.selectedAddTokenB.symbol : window.selectedAddTokenA.symbol;
      
      console.log("=== ADD LIQUIDITY DEBUG ===");
      console.log("SHM Amount:", web3.utils.fromWei(ethAmount, 'ether'));
      console.log("Token Amount:", web3.utils.fromWei(tokenAmount, 'ether'));
      console.log("Token Address:", tokenAddress);
      console.log("Token Symbol:", tokenSymbol);
      
      showStatus('Checking balances...', 'info', 'add-status');
      
      // Check SHM balance
      const shmBalance = await web3.eth.getBalance(currentAccount);
      const requiredSHM = BigInt(ethAmount) + BigInt(web3.utils.toWei('0.01', 'ether'));
      
      console.log("SHM Balance:", web3.utils.fromWei(shmBalance, 'ether'));
      console.log("SHM Required:", web3.utils.fromWei(requiredSHM.toString(), 'ether'));
      
      if (BigInt(shmBalance) < requiredSHM) {
        showStatus('Insufficient SHM balance (need extra for gas)', 'error', 'add-status');
        return;
      }
      
      // Check token balance and decimals
      const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
      
      try {
        const [tokenBalance, tokenDecimals, tokenName] = await Promise.all([
          tokenContract.methods.balanceOf(currentAccount).call(),
          tokenContract.methods.decimals().call(),
          tokenContract.methods.name().call()
        ]);
        
        console.log("Token Name:", tokenName);
        console.log("Token Decimals:", tokenDecimals);
        console.log("Token Balance:", web3.utils.fromWei(tokenBalance, 'ether'));
        console.log("Token Required:", web3.utils.fromWei(tokenAmount, 'ether'));
        
        if (Number(tokenDecimals) !== 18) {
          showStatus(`WARNING: Token has ${tokenDecimals} decimals (expected 18). Conversion may be incorrect.`, 'error', 'add-status');
          console.warn("Token decimals mismatch!");
        }
        
        if (BigInt(tokenBalance) < BigInt(tokenAmount)) {
          showStatus(`Insufficient ${tokenSymbol} balance. Have: ${web3.utils.fromWei(tokenBalance, 'ether')}, Need: ${web3.utils.fromWei(tokenAmount, 'ether')}`, 'error', 'add-status');
          return;
        }
      } catch (error) {
        console.error("Error checking token:", error);
        showStatus('Error checking token - invalid token contract?', 'error', 'add-status');
        return;
      }
      
      // Approve token if needed
      showStatus(`Checking ${tokenSymbol} approval...`, 'info', 'add-status');
      const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
      
      try {
        const allowance = await tokenContract.methods.allowance(currentAccount, ROUTER_ADDRESS).call();
        console.log("Current Allowance:", web3.utils.fromWei(allowance, 'ether'));
        
        if (BigInt(allowance) < BigInt(tokenAmount)) {
          showStatus(`Approving ${tokenSymbol}... Please confirm in MetaMask`, 'info', 'add-status');
          
          const approveTx = await tokenContract.methods.approve(ROUTER_ADDRESS, MAX_UINT256).send({
            from: currentAccount,
            gas: 150000
          });
          
          console.log("Approval TX:", approveTx.transactionHash);
          showStatus('Token approved! Waiting 3 seconds...', 'info', 'add-status');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Verify approval worked
          const newAllowance = await tokenContract.methods.allowance(currentAccount, ROUTER_ADDRESS).call();
          console.log("New Allowance:", web3.utils.fromWei(newAllowance, 'ether'));
          
          if (BigInt(newAllowance) < BigInt(tokenAmount)) {
            showStatus('Approval failed - please try again', 'error', 'add-status');
            return;
          }
        } else {
          console.log("Token already approved ✓");
        }
      } catch (error) {
        console.error("Approval error:", error);
        showStatus('Failed to approve token: ' + error.message, 'error', 'add-status');
        return;
      }
      
      const tokenAmountMin = (BigInt(tokenAmount) * BigInt(95)) / BigInt(100);
      const ethAmountMin = (BigInt(ethAmount) * BigInt(95)) / BigInt(100);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 30;
      
      console.log("=== TRANSACTION PARAMETERS ===");
      console.log("Token:", tokenAddress);
      console.log("Token Amount:", tokenAmount);
      console.log("Token Amount Min:", tokenAmountMin.toString());
      console.log("ETH Amount:", ethAmount);
      console.log("ETH Amount Min:", ethAmountMin.toString());
      console.log("Deadline:", deadline);
      console.log("Router:", ROUTER_ADDRESS);
      
      showStatus('Adding liquidity with SHM (auto-wrapping)... Please confirm in MetaMask', 'info', 'add-status');
      
      // Use addLiquidityETH - Router automatically wraps SHM to WSHM
      try {
        const tx = await routerContract.methods.addLiquidityETH(
          tokenAddress,
          tokenAmount,
          tokenAmountMin.toString(),
          ethAmountMin.toString(),
          currentAccount,
          deadline
        ).send({
          from: currentAccount,
          value: ethAmount,
          gas: 3000000
        });
        
        console.log("Success! TX:", tx.transactionHash);
        showStatus(`Liquidity added successfully! 🎉 <a href="https://explorer.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Transaction</a>`, 'success', 'add-status');
        
        document.getElementById('add-amount-a').value = '';
        document.getElementById('add-amount-b').value = '';
        await updateBalances();
        await loadUserPositions();
      } catch (txError) {
        console.error("Transaction error:", txError);
        
        // Try to extract the actual error
        let errorMsg = 'Transaction failed';
        if (txError.message) {
          if (txError.message.includes('insufficient funds')) {
            errorMsg = 'Insufficient SHM for gas fees';
          } else if (txError.message.includes('user rejected') || txError.message.includes('User denied')) {
            errorMsg = 'Transaction cancelled';
          } else if (txError.message.includes('INSUFFICIENT_')) {
            errorMsg = 'Insufficient liquidity amounts. Try adjusting your ratio.';
          } else {
            errorMsg = 'Transaction failed: ' + txError.message.substring(0, 100);
          }
        }
        
        showStatus(errorMsg, 'error', 'add-status');
        throw txError; // Re-throw for outer catch
      }
      
    } else {
      // Standard token-token liquidity (existing code unchanged)
      showStatus('Checking balances...', 'info', 'add-status');
      
      const tokenAContract = new web3.eth.Contract(ERC20_ABI, window.selectedAddTokenA.address);
      const tokenBContract = new web3.eth.Contract(ERC20_ABI, window.selectedAddTokenB.address);
      
      const balanceA = await tokenAContract.methods.balanceOf(currentAccount).call();
      const balanceB = await tokenBContract.methods.balanceOf(currentAccount).call();
      
      if (BigInt(balanceA) < BigInt(amountAWei)) {
        showStatus(`Insufficient ${window.selectedAddTokenA.symbol} balance`, 'error', 'add-status');
        return;
      }
      
      if (BigInt(balanceB) < BigInt(amountBWei)) {
        showStatus(`Insufficient ${window.selectedAddTokenB.symbol} balance`, 'error', 'add-status');
        return;
      }
      
      const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
      
      showStatus(`Checking ${window.selectedAddTokenA.symbol} approval...`, 'info', 'add-status');
      const allowanceA = await tokenAContract.methods.allowance(currentAccount, ROUTER_ADDRESS).call();
      
      if (BigInt(allowanceA) < BigInt(amountAWei)) {
        showStatus(`Approving ${window.selectedAddTokenA.symbol}...`, 'info', 'add-status');
        await tokenAContract.methods.approve(ROUTER_ADDRESS, MAX_UINT256).send({
          from: currentAccount,
          gas: 150000
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      showStatus(`Checking ${window.selectedAddTokenB.symbol} approval...`, 'info', 'add-status');
      const allowanceB = await tokenBContract.methods.allowance(currentAccount, ROUTER_ADDRESS).call();
      
      if (BigInt(allowanceB) < BigInt(amountBWei)) {
        showStatus(`Approving ${window.selectedAddTokenB.symbol}...`, 'info', 'add-status');
        await tokenBContract.methods.approve(ROUTER_ADDRESS, MAX_UINT256).send({
          from: currentAccount,
          gas: 150000
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      const amountAMin = (BigInt(amountAWei) * BigInt(95)) / BigInt(100);
      const amountBMin = (BigInt(amountBWei) * BigInt(95)) / BigInt(100);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 30;
      
      showStatus('Adding liquidity...', 'info', 'add-status');
      
      const tx = await routerContract.methods.addLiquidity(
        window.selectedAddTokenA.address,
        window.selectedAddTokenB.address,
        amountAWei,
        amountBWei,
        amountAMin.toString(),
        amountBMin.toString(),
        currentAccount,
        deadline
      ).send({
        from: currentAccount,
        maxFeePerGas: web3.utils.toWei('3000', 'gwei'),
        maxPriorityFeePerGas: web3.utils.toWei('3000', 'gwei'),
        gas: 3000000
      });
      
      showStatus(`Liquidity added successfully! 🎉 <a href="https://explorer.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Transaction</a>`, 'success', 'add-status');
      
      document.getElementById('add-amount-a').value = '';
      document.getElementById('add-amount-b').value = '';
      await updateBalances();
      await loadUserPositions();
    }
    
  } catch (error) {
    console.error('Add liquidity error:', error);
    console.error('Error stack:', error.stack);
    
    let errorMsg = 'Failed to add liquidity';
    
    if (error.message.includes('insufficient funds')) {
      errorMsg = 'Insufficient SHM for gas fees';
    } else if (error.message.includes('user rejected') || error.message.includes('User denied')) {
      errorMsg = 'Transaction cancelled by user';
    } else if (error.message.includes('INSUFFICIENT_')) {
      errorMsg = 'Insufficient liquidity or invalid amounts. Try adjusting your amounts.';
    } else if (error.message.includes('EXPIRED')) {
      errorMsg = 'Transaction expired. Please try again.';
    } else {
      errorMsg = `Error: ${error.message}`;
    }
    
    showStatus(errorMsg, 'error', 'add-status');
  }
}
async function removeLiquidity() {
  if (!currentAccount) {
    await connectWallet();
    return;
  }
  
  const pairSelect = document.getElementById('remove-pair-select');
  const removeSlider = document.getElementById('remove-slider');
  
  if (!pairSelect || !pairSelect.value) {
    showStatus('Please select a liquidity pair', 'error', 'remove-status');
    return;
  }
  
  const percentage = parseInt(removeSlider.value);
  if (percentage === 0) {
    showStatus('Please select an amount to remove', 'error', 'remove-status');
    return;
  }
  
  try {
    showStatus('Preparing to remove liquidity...', 'info', 'remove-status');
    
    const pairAddress = pairSelect.value;
    const pairContract = new web3.eth.Contract(PAIR_ABI, pairAddress);
    
    // Get LP balance and calculate amount to remove
    const lpBalance = await pairContract.methods.balanceOf(currentAccount).call();
    const liquidityToRemove = (BigInt(lpBalance) * BigInt(percentage)) / BigInt(100);
    
    console.log("=== REMOVE LIQUIDITY DEBUG ===");
    console.log("LP Balance:", web3.utils.fromWei(lpBalance, 'ether'));
    console.log("Liquidity to remove:", web3.utils.fromWei(liquidityToRemove.toString(), 'ether'));
    console.log("Percentage:", percentage);
    
    // Get token addresses
    const token0 = await pairContract.methods.token0().call();
    const token1 = await pairContract.methods.token1().call();
    
    console.log("Token0:", token0);
    console.log("Token1:", token1);
    console.log("WSHM:", WSHM_ADDRESS);
    
    // Check if this is a WSHM pair (needs removeLiquidityETH)
    const isToken0WSHM = token0.toLowerCase() === WSHM_ADDRESS.toLowerCase();
    const isToken1WSHM = token1.toLowerCase() === WSHM_ADDRESS.toLowerCase();
    const isWSHMPair = isToken0WSHM || isToken1WSHM;
    
    console.log("Is WSHM pair?", isWSHMPair);
    
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    
    // Check and approve LP tokens
    const allowance = await pairContract.methods.allowance(currentAccount, ROUTER_ADDRESS).call();
    console.log("Current allowance:", web3.utils.fromWei(allowance, 'ether'));
    
    if (BigInt(allowance) < BigInt(liquidityToRemove)) {
      showStatus('Approving LP tokens...', 'info', 'remove-status');
      const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
      
      await pairContract.methods.approve(ROUTER_ADDRESS, MAX_UINT256).send({
        from: currentAccount,
        gas: 100000
      });
      
      console.log("LP tokens approved");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    showStatus('Removing liquidity...', 'info', 'remove-status');
    
    let tx;
    
    if (isWSHMPair) {
      // Use removeLiquidityETH for WSHM pairs
      const otherToken = isToken0WSHM ? token1 : token0;
      
      console.log("Using removeLiquidityETH");
      console.log("Other token:", otherToken);
      
      tx = await routerContract.methods.removeLiquidityETH(
        otherToken,
        liquidityToRemove.toString(),
        '0', // amountTokenMin (0 for testing, use slippage in production)
        '0', // amountETHMin (0 for testing, use slippage in production)
        currentAccount,
        deadline
      ).send({
        from: currentAccount,
        gas: 500000
      });
    } else {
      // Standard token-token removal
      console.log("Using removeLiquidity for token-token pair");
      
      tx = await routerContract.methods.removeLiquidity(
        token0,
        token1,
        liquidityToRemove.toString(),
        '0', // amountAMin (0 for testing, use slippage in production)
        '0', // amountBMin (0 for testing, use slippage in production)
        currentAccount,
        deadline
      ).send({
        from: currentAccount,
        gas: 500000
      });
    }
    
    console.log("Transaction successful:", tx.transactionHash);
    showStatus(`Liquidity removed successfully! 🎉 <a href="https://explorer.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Transaction</a>`, 'success', 'remove-status');
    
    removeSlider.value = 0;
    updateRemoveAmount();
    await loadUserPositions();
    
  } catch (error) {
    console.error('Remove liquidity error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    let errorMsg = 'Failed to remove liquidity';
    
    if (error.message) {
      if (error.message.includes('insufficient funds')) {
        errorMsg = 'Insufficient SHM for gas fees';
      } else if (error.message.includes('user rejected') || error.message.includes('User denied')) {
        errorMsg = 'Transaction cancelled by user';
      } else if (error.message.includes('INSUFFICIENT_')) {
        errorMsg = 'Insufficient liquidity. The pool may have changed.';
      } else if (error.message.includes('EXPIRED')) {
        errorMsg = 'Transaction expired. Please try again.';
      } else {
        errorMsg = `Error: ${error.message.substring(0, 150)}`;
      }
    }
    
    showStatus(errorMsg, 'error', 'remove-status');
  }
}

function updateRemoveAmount() {
  const slider = document.getElementById('remove-slider');
  const percentage = document.getElementById('remove-percentage');
  
  if (slider && percentage) {
    percentage.textContent = slider.value;
  }
  
  if (window.currentRemovePosition && slider) {
    const percent = parseInt(slider.value);
    const amount0 = (parseFloat(window.currentRemovePosition.amount0) * percent) / 100;
    const amount1 = (parseFloat(window.currentRemovePosition.amount1) * percent) / 100;
    const lpTokens = (parseFloat(window.currentRemovePosition.lpBalance) * percent) / 100;
    
    // Update amounts if elements exist
    const receiveA = document.getElementById('receive-amount-a');
    const receiveB = document.getElementById('receive-amount-b');
    const lpBurn = document.getElementById('lp-to-burn');
    const removeAmounts = document.getElementById('remove-amounts');
    
    if (receiveA) receiveA.textContent = amount0.toFixed(6);
    if (receiveB) receiveB.textContent = amount1.toFixed(6);
    if (lpBurn) lpBurn.textContent = lpTokens.toFixed(6);
    
    // If individual elements don't exist, try the combined display
    if (removeAmounts && window.currentRemovePosition) {
      removeAmounts.innerHTML = `
        ${window.currentRemovePosition.token0.symbol}: ${amount0.toFixed(6)}<br>
        ${window.currentRemovePosition.token1.symbol}: ${amount1.toFixed(6)}
      `;
    }
  }
}

async function loadUserPositions() {
  if (!currentAccount) {
    console.log("No account connected");
    return;
  }
  
  console.log("=== LOADING USER POSITIONS ===");
  console.log("Current Account:", currentAccount);
  console.log("Factory Address:", FACTORY_ADDRESS);
  console.log("WSHM Address:", WSHM_ADDRESS);
  
  const positionsContainer = document.getElementById('positions-container');
  const pairSelect = document.getElementById('remove-pair-select');
  
  if (positionsContainer) {
    positionsContainer.innerHTML = '<div class="loading" style="text-align: center; padding: 40px;">Loading positions...</div>';
  }
  
  try {
    const pairCount = await factoryContract.methods.allPairsLength().call();
    console.log(`Total pairs in factory: ${pairCount}`);
    
    const positions = [];
    
    for (let i = 0; i < pairCount; i++) {
      const pairAddress = await factoryContract.methods.allPairs(i).call();
      console.log(`\n--- Checking pair ${i}: ${pairAddress}`);
      
      const pairContract = new web3.eth.Contract(PAIR_ABI, pairAddress);
      
      try {
        const lpBalance = await pairContract.methods.balanceOf(currentAccount).call();
        console.log(`LP Balance: ${web3.utils.fromWei(lpBalance, 'ether')}`);
        
        if (BigInt(lpBalance) > 0n) {
          console.log("✅ Found position!");
          
          const token0Address = await pairContract.methods.token0().call();
          const token1Address = await pairContract.methods.token1().call();
          
          console.log(`Token0 Address: ${token0Address}`);
          console.log(`Token1 Address: ${token1Address}`);
          
          const token0Contract = new web3.eth.Contract(ERC20_ABI, token0Address);
          const token1Contract = new web3.eth.Contract(ERC20_ABI, token1Address);
          
          const [symbol0, symbol1, name0, name1, totalSupply, reserves] = await Promise.all([
            token0Contract.methods.symbol().call(),
            token1Contract.methods.symbol().call(),
            token0Contract.methods.name().call(),
            token1Contract.methods.name().call(),
            pairContract.methods.totalSupply().call(),
            pairContract.methods.getReserves().call()
          ]);
          
          console.log(`Token0: ${symbol0} (${name0})`);
          console.log(`Token1: ${symbol1} (${name1})`);
          
          // Convert WSHM to SHM for display
          const displaySymbol0 = (token0Address.toLowerCase() === WSHM_ADDRESS.toLowerCase()) ? 'SHM' : symbol0;
          const displaySymbol1 = (token1Address.toLowerCase() === WSHM_ADDRESS.toLowerCase()) ? 'SHM' : symbol1;
          
          console.log(`Display as: ${displaySymbol0}/${displaySymbol1}`);
          
          const poolShare = (BigInt(lpBalance) * BigInt(10000)) / BigInt(totalSupply);
          const sharePercent = Number(poolShare) / 100;
          
          const amount0 = (BigInt(lpBalance) * BigInt(reserves.reserve0)) / BigInt(totalSupply);
          const amount1 = (BigInt(lpBalance) * BigInt(reserves.reserve1)) / BigInt(totalSupply);
          
          positions.push({
            pairAddress,
            token0: { address: token0Address, symbol: displaySymbol0, name: name0 },
            token1: { address: token1Address, symbol: displaySymbol1, name: name1 },
            lpBalance: web3.utils.fromWei(lpBalance, 'ether'),
            amount0: web3.utils.fromWei(amount0.toString(), 'ether'),
            amount1: web3.utils.fromWei(amount1.toString(), 'ether'),
            sharePercent: sharePercent.toFixed(4)
          });
        } else {
          console.log("No balance in this pair");
        }
      } catch (error) {
        console.error(`Error checking pair ${i}:`, error);
      }
    }
    
    console.log(`\n=== TOTAL POSITIONS FOUND: ${positions.length} ===`);
    
    console.log("positionsContainer element:", positionsContainer);
    console.log("Is positionsContainer null?", positionsContainer === null);
    
    if (pairSelect) {
      pairSelect.innerHTML = '<option value="">Select a liquidity pair</option>';
      positions.forEach(pos => {
        const option = document.createElement('option');
        option.value = pos.pairAddress;
        option.textContent = `${pos.token0.symbol}/${pos.token1.symbol}`;
        option.dataset.position = JSON.stringify(pos);
        pairSelect.appendChild(option);
      });
      
      pairSelect.onchange = function() {
        if (this.value) {
          const posData = JSON.parse(this.options[this.selectedIndex].dataset.position);
          updateRemoveDisplay(posData);
        }
      };
    }
    
    if (positionsContainer) {
      if (positions.length === 0) {
        positionsContainer.innerHTML = `
          <div class="no-positions">
            <p style="font-size: 1.2rem; margin-bottom: 10px;">📊 No positions found</p>
            <p>Check console (F12) for debugging info</p>
            <button class="action-btn" style="margin-top: 20px; max-width: 200px;" onclick="document.querySelector('[data-tab=add]').click()">
              Add Liquidity
            </button>
          </div>
        `;
      } else {
        console.log("About to render", positions.length, "positions");
        console.log("positionsContainer before setting HTML:", positionsContainer);
        const html = positions.map(pos => `
          <div class="position-card">
            <div class="position-header">
              <h3>${pos.token0.symbol}/${pos.token1.symbol}</h3>
              <span class="position-badge">${pos.sharePercent}% of pool</span>
            </div>
            <div class="position-details">
              <div class="detail-row">
                <span>${pos.token0.symbol}:</span>
                <span>${parseFloat(pos.amount0).toFixed(6)}</span>
              </div>
              <div class="detail-row">
                <span>${pos.token1.symbol}:</span>
                <span>${parseFloat(pos.amount1).toFixed(6)}</span>
              </div>
              <div class="detail-row">
                <span>LP Tokens:</span>
                <span>${parseFloat(pos.lpBalance).toFixed(6)}</span>
              </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button class="action-btn" onclick="removeLiquidityFromCard('${pos.pairAddress}')" style="flex: 1;">
                Remove Liquidity
              </button>
              <button class="action-btn" onclick="addLPToMetaMask('${pos.pairAddress}', '${pos.token0.symbol}', '${pos.token1.symbol}')" style="flex: 1; background: #764ba2;">
                Add to MetaMask
              </button>
            </div>
          </div>
        `).join('');
        
        console.log("Generated HTML length:", html.length);
        console.log("First 200 chars of HTML:", html.substring(0, 200));
        
        positionsContainer.innerHTML = html;
        console.log("HTML inserted! positionsContainer.children.length:", positionsContainer.children.length);
      }
    } else {
      console.error("❌ positionsContainer is NULL!");
    }
    
  } catch (error) {
    console.error('Error loading positions:', error);
    if (positionsContainer) {
      positionsContainer.innerHTML = '<div class="no-positions"><p>Error loading positions. Check console for details.</p></div>';
    }
  }
}

function updateRemoveDisplay(position) {
  console.log("updateRemoveDisplay called with:", position);
  
  const removeDetails = document.getElementById('remove-pool-details');
  if (removeDetails) {
    // Try to update labels if they exist
    const labelA = document.getElementById('receive-token-a-label');
    const labelB = document.getElementById('receive-token-b-label');
    
    if (labelA) labelA.textContent = `${position.token0.symbol}:`;
    if (labelB) labelB.textContent = `${position.token1.symbol}:`;
    
    // If labels don't exist, just show the details
    removeDetails.style.display = 'block';
  }
  
  window.currentRemovePosition = position;
  updateRemoveAmount();
}

function removeLiquidityFromCard(pairAddress) {
  switchTab('remove');
  
  const pairSelect = document.getElementById('remove-pair-select');
  if (pairSelect) {
    pairSelect.value = pairAddress;
    pairSelect.dispatchEvent(new Event('change'));
  }
}

function switchTab(tabName) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  
  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
  const activeContent = document.getElementById(`${tabName}-tab`);
  
  if (activeBtn) activeBtn.classList.add('active');
  if (activeContent) activeContent.classList.add('active');
  
  if (tabName === 'positions' || tabName === 'remove') {
    loadUserPositions();
  }
}

async function updateBalances() {
  if (!currentAccount) return;
  
  if (selectedTokenIn) {
    if (selectedTokenIn.isNative) {
      const balance = await web3.eth.getBalance(currentAccount);
      selectedTokenIn.balance = web3.utils.fromWei(balance, 'ether');
    } else {
      const tokenContract = new web3.eth.Contract(ERC20_ABI, selectedTokenIn.address);
      const balance = await tokenContract.methods.balanceOf(currentAccount).call();
      selectedTokenIn.balance = web3.utils.fromWei(balance, 'ether');
    }
    document.getElementById('balance-in').textContent = `Balance: ${parseFloat(selectedTokenIn.balance).toFixed(4)}`;
  }
  
  if (selectedTokenOut) {
    if (selectedTokenOut.isNative) {
      const balance = await web3.eth.getBalance(currentAccount);
      selectedTokenOut.balance = web3.utils.fromWei(balance, 'ether');
    } else {
      const tokenContract = new web3.eth.Contract(ERC20_ABI, selectedTokenOut.address);
      const balance = await tokenContract.methods.balanceOf(currentAccount).call();
      selectedTokenOut.balance = web3.utils.fromWei(balance, 'ether');
    }
    document.getElementById('balance-out').textContent = `Balance: ${parseFloat(selectedTokenOut.balance).toFixed(4)}`;
  }
}

function showStatus(message, type, elementId = 'status-message') {
  const statusEl = document.getElementById(elementId);
  if (!statusEl) return;
  
  statusEl.innerHTML = message;
  statusEl.className = `status-message ${type}`;
  statusEl.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 10000);
  }
}


async function addLPToMetaMask(pairAddress, symbol0, symbol1) {
  try {
    // LP tokens are ERC20, so use ERC20_ABI
    const pairContract = new web3.eth.Contract(ERC20_ABI, pairAddress);
    
    // Get symbol and decimals
    const [symbol, decimals] = await Promise.all([
      pairContract.methods.symbol().call().catch(() => `${symbol0}-${symbol1} LP`),
      pairContract.methods.decimals().call().catch(() => 18)
    ]);
    
    console.log(`Adding LP token to MetaMask: ${symbol} (${decimals} decimals)`);
    
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: pairAddress,
          symbol: symbol,
          decimals: Number(decimals),
          image: 'https://raw.githubusercontent.com/BrunoMarshall/MintonDex/main/logos/lp-token.png'
        }
      }
    });
    
    if (wasAdded) {
      showStatus(`${symbol0}/${symbol1} LP token added to MetaMask!`, 'success', 'add-status');
      console.log("✅ LP token added to MetaMask successfully!");
    } else {
      console.log("User cancelled adding LP token");
    }
  } catch (error) {
    console.error('Error adding LP to MetaMask:', error);
    showStatus('Failed to add LP token to MetaMask', 'error', 'add-status');
  }
}

window.selectToken = selectToken;
window.loadTokenList = loadTokenList;
window.removeLiquidityFromCard = removeLiquidityFromCard;
window.addLPToMetaMask = addLPToMetaMask;
