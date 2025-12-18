// contracts/Staking.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is Ownable {
    IERC20 public stakingToken;

    // Tasa de recompensa: 1 token por minuto por cada 100 staked (muy alta para pruebas)
    uint256 public rewardRatePerMinute = 1; 

    struct Stake {
        uint256 amount;
        uint256 startTime;
    }

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
    }

    /**
     * @dev Calcula las recompensas acumuladas
     */
    function calculateReward(address account) public view returns (uint256) {
        Stake memory userStake = stakes[account];
        if (userStake.amount == 0) return 0;

        uint256 timeElapsed = (block.timestamp - userStake.startTime) / 60; // Minutos transcurridos
        // Recompensa = (monto / 100) * tiempo * tasa
        return (userStake.amount * timeElapsed * rewardRatePerMinute) / 100;
    }

    /**
     * @dev Depositar tokens en staking
     */
    function stake(uint256 amount) public {
        require(amount > 0, "Monto debe ser mayor a 0");
        
        // Antes de un nuevo stake, guardamos lo ganado anteriormente
        rewards[msg.sender] += calculateReward(msg.sender);

        // Transferimos los tokens del usuario al contrato (Requiere APPROVE previo)
        bool success = stakingToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Transferencia fallida (Diste permiso/approve?)");

        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Retirar todo el dinero y reclamar recompensas
     */
    function withdraw() public {
        uint256 amount = stakes[msg.sender].amount;
        require(amount > 0, "No tienes nada depositado");

        uint256 reward = rewards[msg.sender] + calculateReward(msg.sender);
        
        // Limpiamos el estado antes de transferir (Seguridad anti-reentrancy)
        stakes[msg.sender].amount = 0;
        stakes[msg.sender].startTime = 0;
        rewards[msg.sender] = 0;

        // Devolvemos el capital
        stakingToken.transfer(msg.sender, amount);
        
        // Entregamos el premio (si el contrato tiene fondos)
        if (reward > 0 && stakingToken.balanceOf(address(this)) >= reward) {
            stakingToken.transfer(msg.sender, reward);
            emit RewardClaimed(msg.sender, reward);
        }

        emit Withdrawn(msg.sender, amount);
    }
}
