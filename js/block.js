export default class Block {
  constructor(index, timestamp, data, previousHash, hash, nonce, valid) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = hash;
    this.nonce = nonce;
    this.valid = valid;
  }
}
