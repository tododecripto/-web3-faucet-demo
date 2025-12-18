// contracts/Vendor.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vendor is Ownable {
    // El token que vamos a vender
    IERC20 public myToken;

    // Cuantos tokens damos por cada 1 ETH
    uint256 public tokensPerEth = 100000;

    // Evento para avisar que alguien compro
    event BuyTokens(address buyer, uint256 amountOfEth, uint256 amountOfTokens);

    constructor(address tokenAddress) Ownable(msg.sender) {
        myToken = IERC20(tokenAddress);
    }

    /**
     * @dev Permite a los usuarios comprar tokens enviando ETH
     */
    function buyTokens() public payable {
        require(msg.value > 0, "Envia algo de ETH para comprar tokens");

        uint256 amountToBuy = msg.value * tokensPerEth;

        // Verificamos que la tienda tenga suficientes tokens
        uint256 vendorBalance = myToken.balanceOf(address(this));
        require(vendorBalance >= amountToBuy, "La tienda no tiene suficientes tokens");

        // Enviamos los tokens al comprador
        (bool sent) = myToken.transfer(msg.sender, amountToBuy);
        require(sent, "Fallo el envio de tokens");

        emit BuyTokens(msg.sender, msg.value, amountToBuy);
    }

    /**
     * @dev Permite al dueño retirar el ETH ganado por las ventas
     */
    function withdraw() public onlyOwner {
        uint256 ownerAmount = address(this).balance;
        require(ownerAmount > 0, "No hay ETH para retirar");

        (bool sent, ) = msg.sender.call{value: ownerAmount}("");
        require(sent, "Fallo el retiro de ETH");
    }
}
