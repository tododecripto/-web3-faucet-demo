import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  async function deployMyTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const initialSupply = ethers.parseEther("1000"); // 1000 tokens

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(initialSupply);

    return { myToken, owner, addr1, addr2, initialSupply };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { myToken, owner } = await deployMyTokenFixture();
      expect(await myToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { myToken, owner, initialSupply } = await deployMyTokenFixture();
      expect(await myToken.balanceOf(owner.address)).to.equal(initialSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { myToken, owner, addr1 } = await deployMyTokenFixture();

      // Transfer 50 tokens from owner to addr1
      await expect(myToken.transfer(addr1.address, ethers.parseEther("50")))
        .to.changeTokenBalances(myToken, [owner, addr1], [ethers.parseEther("-50"), ethers.parseEther("50")]);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const { myToken, owner, addr1 } = await deployMyTokenFixture();
      const initialOwnerBalance = await myToken.balanceOf(owner.address);

      // Try to transfer 1001 tokens from owner (initial supply is 1000)
      // and expect a revert with a specific message (from ERC20)
      await expect(myToken.transfer(addr1.address, ethers.parseEther("1001")))
        .to.be.revertedWithCustomError(myToken, "ERC20InsufficientBalance");
    });

    it("Should update balances after transfers", async function () {
      const { myToken, owner, addr1, addr2 } = await deployMyTokenFixture();

      // Transfer 100 tokens from owner to addr1
      await myToken.transfer(addr1.address, ethers.parseEther("100"));
      expect(await myToken.balanceOf(owner.address)).to.equal(ethers.parseEther("900"));
      expect(await myToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));

      // Transfer 50 tokens from addr1 to addr2
      await myToken.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));
      expect(await myToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("50"));
      expect(await myToken.balanceOf(addr2.address)).to.equal(ethers.parseEther("50"));
    });
  });
});
