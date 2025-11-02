const web3 = new Web3(window.ethereum);

// WSHM Contract Address
const WSHM_ADDRESS = "0x9988864cb024f0a647c205dbbf96535b0072f40b";

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
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const wshmContract = new web3.eth.Contract(WSHM_ABI, WSHM_ADDRESS);

let currentAccount = null;

// Network Configuration
const SHARDEUM_TESTNET = {
  chainId: '0x1FB7',
  chainName: 'Shardeum EVM Testnet',
  nativeCurrency: { name: 'Shardeum', symbol: 'SHM', decimals: 18 },
  rpcUrls: ['https://api-mezame.shardeum.org/'],
  blockExplorerUrls: ['https://explorer-mezame.shardeum.org/']
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await initializeApp();
  setupEventListeners();
});

async function initializeApp() {
  if (window.ethereum) {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        await updateBalances();
        updateButtonStates();
      }
    } catch (error) {
      console.error('Error initializing:', error);
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', () => window.location.reload());
  }
}

function setupEventListeners() {
  // Connect/Disconnect
  document.getElementById('connect-metamask')?.addEventListener('click', connectWallet);
  document.getElementById('disconnect-metamask')?.addEventListener('click', disconnectWallet);

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Wrap
  document.getElementById('wrap-amount')?.addEventListener('input', updateWrapOutput);
  document.getElementById('wrap-max-btn')?.addEventListener('click', setMaxWrap);
  document.getElementById('wrap-btn')?.addEventListener('click', wrapSHM);

  // Unwrap
  document.getElementById('unwrap-amount')?.addEventListener('input', updateUnwrapOutput);
  document.getElementById('unwrap-max-btn')?.addEventListener('click', setMaxUnwrap);
  document.getElementById('unwrap-btn')?.addEventListener('click', unwrapSHM);
}

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask not installed');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    currentAccount = accounts[0];

    const chainId = await web3.eth.getChainId();
    if (Number(chainId) !== 8119) {
      await switchToShardeum();
    }

    await updateBalances();
    updateButtonStates();
    showStatus('Connected successfully!', 'success', 'wrap-status');
  } catch (error) {
    console.error('Connection error:', error);
    showStatus('Failed to connect', 'error', 'wrap-status');
  }
}

async function switchToShardeum() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SHARDEUM_TESTNET.chainId }]
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [SHARDEUM_TESTNET]
      });
    }
  }
}

function disconnectWallet() {
  currentAccount = null;
  updateButtonStates();
  document.getElementById('shm-balance').textContent = 'Balance: 0.00 SHM';
  document.getElementById('wshm-balance').textContent = 'Balance: 0.00 WSHM';
}

async function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    currentAccount = null;
  } else {
    currentAccount = accounts[0];
  }
  await updateBalances();
  updateButtonStates();
}

async function updateBalances() {
  if (!currentAccount) return;

  try {
    // Get SHM balance
    const shmBalance = await web3.eth.getBalance(currentAccount);
    const shmBalanceEth = web3.utils.fromWei(shmBalance, 'ether');
    
    // Get WSHM balance
    const wshmBalance = await wshmContract.methods.balanceOf(currentAccount).call();
    const wshmBalanceEth = web3.utils.fromWei(wshmBalance, 'ether');

    // Update all balance displays
    const shmBalanceText = `Balance: ${parseFloat(shmBalanceEth).toFixed(4)} SHM`;
    const wshmBalanceText = `Balance: ${parseFloat(wshmBalanceEth).toFixed(4)} WSHM`;

    document.getElementById('shm-balance').textContent = shmBalanceText;
    document.getElementById('wshm-balance').textContent = wshmBalanceText;
    document.getElementById('unwrap-wshm-balance').textContent = wshmBalanceText;
    document.getElementById('unwrap-shm-balance').textContent = shmBalanceText;
  } catch (error) {
    console.error('Error updating balances:', error);
  }
}

function updateButtonStates() {
  const wrapBtn = document.getElementById('wrap-btn');
  const unwrapBtn = document.getElementById('unwrap-btn');

  if (wrapBtn) {
    wrapBtn.textContent = currentAccount ? 'Wrap SHM' : 'Connect Wallet';
    wrapBtn.disabled = !currentAccount;
  }

  if (unwrapBtn) {
    unwrapBtn.textContent = currentAccount ? 'Unwrap WSHM' : 'Connect Wallet';
    unwrapBtn.disabled = !currentAccount;
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

function updateWrapOutput() {
  const amount = document.getElementById('wrap-amount').value;
  document.getElementById('wrap-output').value = amount;
}

function updateUnwrapOutput() {
  const amount = document.getElementById('unwrap-amount').value;
  document.getElementById('unwrap-output').value = amount;
}

async function setMaxWrap() {
  if (!currentAccount) return;

  try {
    const balance = await web3.eth.getBalance(currentAccount);
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    // Leave 0.1 SHM for gas
    const maxAmount = Math.max(0, parseFloat(balanceEth) - 0.1);
    
    document.getElementById('wrap-amount').value = maxAmount.toFixed(6);
    updateWrapOutput();
  } catch (error) {
    console.error('Error setting max:', error);
  }
}

async function setMaxUnwrap() {
  if (!currentAccount) return;

  try {
    const balance = await wshmContract.methods.balanceOf(currentAccount).call();
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    
    document.getElementById('unwrap-amount').value = balanceEth;
    updateUnwrapOutput();
  } catch (error) {
    console.error('Error setting max:', error);
  }
}

async function wrapSHM() {
  if (!currentAccount) {
    await connectWallet();
    return;
  }

  const amount = document.getElementById('wrap-amount').value;

  if (!amount || parseFloat(amount) <= 0) {
    showStatus('Please enter a valid amount', 'error', 'wrap-status');
    return;
  }

  try {
    showStatus('Wrapping SHM...', 'info', 'wrap-status');

    const amountWei = web3.utils.toWei(amount, 'ether');

    const tx = await wshmContract.methods.deposit().send({
      from: currentAccount,
      value: amountWei,
      maxFeePerGas: web3.utils.toWei('2500000', 'gwei'),
      maxPriorityFeePerGas: web3.utils.toWei('2500000', 'gwei'),
      gas: 100000
    });

    showStatus(`Successfully wrapped ${amount} SHM! <a href="https://explorer-mezame.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Transaction</a>`, 'success', 'wrap-status');
    
    document.getElementById('wrap-amount').value = '';
    document.getElementById('wrap-output').value = '';
    await updateBalances();
  } catch (error) {
    console.error('Wrap error:', error);
    showStatus(error.message || 'Failed to wrap SHM', 'error', 'wrap-status');
  }
}

async function unwrapSHM() {
  if (!currentAccount) {
    await connectWallet();
    return;
  }

  const amount = document.getElementById('unwrap-amount').value;

  if (!amount || parseFloat(amount) <= 0) {
    showStatus('Please enter a valid amount', 'error', 'unwrap-status');
    return;
  }

  try {
    showStatus('Unwrapping WSHM...', 'info', 'unwrap-status');

    const amountWei = web3.utils.toWei(amount, 'ether');

    const tx = await wshmContract.methods.withdraw(amountWei).send({
      from: currentAccount,
      maxFeePerGas: web3.utils.toWei('2500000', 'gwei'),
      maxPriorityFeePerGas: web3.utils.toWei('2500000', 'gwei'),
      gas: 100000
    });

    showStatus(`Successfully unwrapped ${amount} WSHM! <a href="https://explorer-mezame.shardeum.org/tx/${tx.transactionHash}" target="_blank">View Transaction</a>`, 'success', 'unwrap-status');
    
    document.getElementById('unwrap-amount').value = '';
    document.getElementById('unwrap-output').value = '';
    await updateBalances();
  } catch (error) {
    console.error('Unwrap error:', error);
    showStatus(error.message || 'Failed to unwrap WSHM', 'error', 'unwrap-status');
  }
}

function showStatus(message, type, elementId) {
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