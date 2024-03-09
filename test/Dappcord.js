const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Dappcord", function () {

  let dappcord;
  const NAME = "Dappcord"
  const SYMBOL = "DC"

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners()
    // Deploy Contract
    const Dappcord = await ethers.getContractFactory("Dappcord");
    dappcord = await Dappcord.deploy(NAME, SYMBOL);

    // Create channel
    const transaction = await dappcord.connect(deployer).createChannel("general",tokens(1))
    await transaction.wait()
  });

  describe("Deployment", function () {
    
    it("Sets the name ", async () => {
      // Fetch name of contract
      let result = await dappcord.name();
      expect(result).to.equal(NAME);
    });

    it("Sets the name & symbol", async () => {
      // Fetch symbol of contract.
      let result = await dappcord.symbol();
      expect(result).to.equal(SYMBOL);
    });

    it("Sets the owner", async () => {
      const result = await dappcord.owner()
      expect(result).to.equal(deployer.address)
    })
  });

  describe("Creating Channels", function () {
    
    it("Returns total channels", async () => {
      // Fetch name of contract
      const result = await dappcord.totalChannels()
      expect(result).to.be.equal(1)
    });

    it("Returns channel attributes", async() =>{
      const channel = await dappcord.getChannel(1)
      expect(channel.id).to.be.equal(1)
      expect(channel.name).to.be.equal("general")
      expect(channel.cost).to.be.equal(tokens(1))
    })

    it("Only Owner creates channel", async() =>{
      await expect(dappcord.connect(user).createChannel("general", tokens(1))).to.be.revertedWith("Not authorized");
    })
  });

  describe("Joining Channels", function () {
    
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("1", 'ether')
    
    beforeEach(async () => {
      const transaction = await dappcord.connect(user).mint(ID, {value: AMOUNT});
      await transaction.wait
    })

    it("Joins the user", async () => {
      const result = await dappcord.hasJoined(1,user.address);
      expect(result).to.be.equal(true)
    });

    it("Increases total Supply", async () => {
      const result = await dappcord.totalSupply()
      expect(result).to.be.equal(ID)
    })

    it("Update the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappcord.address)
      expect(result).to.be.equal(AMOUNT)
    })

  });

});
