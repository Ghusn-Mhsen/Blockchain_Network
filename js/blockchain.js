import Block from "./block.js";

export default class Blockchain {
  constructor() {
    // Initialize the blockchain with an empty chain and a difficulty of 4
    this.chain = [];
    this.difficulty = 4;
  }

  // Create the genesis block of the blockchain
  async createGenesisBlock() {
    const timestamp = new Date().toISOString();1
    const hash = this.calculateHash(
      0,
      timestamp,
      "Genesis Block",
      "0",
      0
    );
    const block = new Block(0, timestamp, "Genesis Block", "0", hash, 0, true);
    // Mine the genesis block and add it to the chain
    await this.mineBlock(block);
    this.chain[0] = block;
  }

  // Calculate the SHA256 hash of a block's data
  calculateHash(index, timestamp, data, previousHash, nonce) {
    const hash = CryptoJS.SHA256(
      index.toString() +
        timestamp.toString() +
        JSON.stringify(data) +
        previousHash +
        nonce.toString()
    ).toString(CryptoJS.enc.Hex);
    return hash;
  }

  // Mine a block by finding a hash that meets the target difficulty
  async mineBlock(block) {
    const target = "0".repeat(this.difficulty);
    let nonce = 0;

    while (true) {
      const hash =  this.calculateHash(
        block.index,
        block.timestamp,
        block.data,
        block.previousHash,
        nonce
      );
      console.log(hash);
      if (hash.startsWith(target)) {
        // If the hash meets the target difficulty, set the block's hash and nonce, mark it as valid, and add it to the chain
        block.hash = hash;
        block.nonce = nonce;
        block.valid = true;
        this.chain[block.index] = block;
        break;
      }

      nonce++;
      // If the hash does not meet the target difficulty, mark the block as invalid and continue searching
      block.valid = false;
    }
  }

  // Add a new block to the blockchain
  async addBlock(data) {
    const previousBlock = this.chain[this.chain.length - 1];
    const index = previousBlock.index + 1;
    const timestamp = new Date().toISOString();
    const nonce = 0;
    const previousHash = await previousBlock.hash;
    const hash = await this.calculateHash(
      index,
      timestamp,
      data,
      previousHash,
      nonce
    );

    const newBlock = new Block(
      index,
      timestamp,
      data,
      previousHash,
      hash,
      nonce,
      true
    );

    // Mine the new block and add it to the chain
    await this.mineBlock(newBlock);

    return this.chain;
  }

  // Get the current state of the blockchain
  getBlock() {
    return this.chain;
  }

  // Invalidate a block and all subsequent blocks// Mark a block as invalid and set all subsequent blocks as invalid as well
  notValid(block) {
    this.chain[block.index].data = block.data;
    for (let i = block.index; i < this.chain.length; i++) {
      this.chain[i].valid = false;
    }
  }
}
