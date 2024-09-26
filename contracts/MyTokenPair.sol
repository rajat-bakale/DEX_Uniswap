// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyTokenPair is IERC20 {
    address public token0;
    address public token1;
    uint public reserve0;
    uint public reserve1;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    uint private _totalSupply;

    event Debug(string message, uint value1, uint value2);

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        return _transfer(msg.sender, to, amount);
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        require(allowance[from][msg.sender] >= amount, "ERC20: insufficient allowance");
        allowance[from][msg.sender] -= amount;
        return _transfer(from, to, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal returns (bool) {
        require(balanceOf[from] >= amount, "ERC20: transfer amount exceeds balance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint amount0, uint amount1) external {
        require(amount0 > 0 && amount1 > 0, "Invalid liquidity amounts");
        uint liquidity = sqrt(amount0 * amount1);
        require(liquidity > 0, "Insufficient liquidity minted");

        reserve0 += amount0;
        reserve1 += amount1;
        balanceOf[to] += liquidity;
        _totalSupply += liquidity;
        emit Transfer(address(0), to, liquidity);
    }

    function burn() external returns (uint amount0, uint amount1) {
    uint liquidity = balanceOf[address(this)];
    require(liquidity > 0, "No liquidity to burn");

    emit Debug("Reserves before burn:", reserve0, reserve1);
    emit Debug("Liquidity before burn:", liquidity, _totalSupply);

    amount0 = (liquidity * reserve0) / _totalSupply;
    amount1 = (liquidity * reserve1) / _totalSupply;

    require(amount0 > 0 && amount1 > 0, "Insufficient liquidity burned");

    _burn(address(this), liquidity);
    reserve0 -= amount0;
    reserve1 -= amount1;

    emit Debug("Reserves after burn:", reserve0, reserve1);
    emit Debug("Amounts returned:", amount0, amount1);

    return (amount0, amount1);
}

function _burn(address account, uint256 amount) internal {
    require(account != address(0), "ERC20: burn from the zero address");
    require(balanceOf[account] >= amount, "ERC20: burn amount exceeds balance");
    
    balanceOf[account] -= amount;
    _totalSupply -= amount;
    emit Transfer(account, address(0), amount);
}

    function getReserves() external view returns (uint, uint) {
        return (reserve0, reserve1);
    }

    function updateReserves(uint _reserve0, uint _reserve1) external {
        reserve0 = _reserve0;
        reserve1 = _reserve1;
    }

    function sqrt(uint x) internal pure returns (uint y) {
        if (x == 0) return 0;
        else {
            uint z = (x + 1) / 2;
            y = x;
            while (z < y) {
                y = z;
                z = (x / z + z) / 2;
            }
        }
    }
}