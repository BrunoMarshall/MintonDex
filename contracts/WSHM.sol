// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WSHM - Wrapped Shardeum
 * @notice Wrapped native SHM token (ERC-20) for Shardeum Mainnet
 * @dev Standard WETH9-style wrapper (battle-tested design used across all EVM chains)
 * 
 * SECURITY NOTES:
 * - Based on canonical WETH9 implementation (audited and used on Ethereum mainnet)
 * - Uses Solidity 0.8.20+ built-in overflow protection
 * - Simple, minimalist design - no admin functions or upgradability
 * - 1:1 peg with native SHM is mathematically guaranteed
 * - Not formally audited - use at your own risk
 */
contract WSHM {
    string public name     = "Wrapped SHM";
    string public symbol   = "WSHM";
    uint8  public decimals = 18;

    event Approval(address indexed src, address indexed guy, uint wad);
    event Transfer(address indexed src, address indexed dst, uint wad);
    event Deposit(address indexed dst, uint wad);
    event Withdrawal(address indexed src, uint wad);

    mapping (address => uint)                       public  balanceOf;
    mapping (address => mapping (address => uint))  public  allowance;

    receive() external payable {
        deposit();
    }

    /**
     * @notice Wrap SHM to WSHM (1:1)
     * @dev Send SHM with this transaction to receive WSHM
     */
    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @notice Unwrap WSHM back to SHM (1:1)
     * @param wad Amount of WSHM to unwrap
     */
    function withdraw(uint wad) public {
        require(balanceOf[msg.sender] >= wad, "Insufficient balance");
        balanceOf[msg.sender] -= wad;
        payable(msg.sender).transfer(wad);
        emit Withdrawal(msg.sender, wad);
    }

    function totalSupply() public view returns (uint) {
        return address(this).balance;
    }

    function approve(address guy, uint wad) public returns (bool) {
        allowance[msg.sender][guy] = wad;
        emit Approval(msg.sender, guy, wad);
        return true;
    }

    function transfer(address dst, uint wad) public returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }

    function transferFrom(address src, address dst, uint wad) public returns (bool) {
        require(balanceOf[src] >= wad, "Insufficient balance");

        if (src != msg.sender && allowance[src][msg.sender] != type(uint).max) {
            require(allowance[src][msg.sender] >= wad, "Insufficient allowance");
            allowance[src][msg.sender] -= wad;
        }

        balanceOf[src] -= wad;
        balanceOf[dst] += wad;

        emit Transfer(src, dst, wad);

        return true;
    }
}
