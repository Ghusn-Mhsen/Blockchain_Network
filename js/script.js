import Blockchain from "./blockchain.js";
const blockchain = new Blockchain();

// Function to add a new block to the blockchain
async function addBlock() {
  await blockchain.createGenesisBlock();
  const blockDataInput = document.getElementById('blockData');
  const data = blockDataInput.value.trim();

  if (data) {
    const newBlock = await blockchain.addBlock(data);
    blockDataInput.value = '';
    getBlocks(newBlock);
  }
}

// Add event listener to the "Add Block" button
const addButton = document.getElementById('myButton');
addButton.addEventListener('click', addBlock);

// Function to display the blockchain on the page
function getBlocks(blocks) {
  const blockContainer = document.getElementById("blockContainer");
  blockContainer.innerHTML = "";

  blocks.forEach((block, index) => {
    // Create a new block item and card
    const blockItem = document.createElement("div");
    blockItem.classList.add("block");
    const card = document.createElement("div");
    card.classList.add("card");
    
    // Set the content of the card using the block data
    card.innerHTML = `
          <p>Block ${block.index}</p>
          <input class="editable" type="text" value="${block.data}">
          <p>Nonce: ${block.nonce}</p>
          <div class="line-break"></div>
          <p>Hash:</p>
          <div class="multiline">${block.hash}</div>
          <div class="line-break"></div>
          <p>Previous Hash:</p>
          <div class="multiline">${block.previousHash}</div>
          <div class="line-break"></div>
          <p>Timestamp: ${block.timestamp}</p>
          <div class="invalid-indicator"></div>
          <button class="mine-button">Mine</button>
          <button class="save-button">Save</button>
          <br>
        `;

    // Add the card to the block item and the block item to the container
    blockItem.appendChild(card);
    blockContainer.appendChild(blockItem);

    // Add an invalid/valid indicator to the card
    const invalidIndicator = blockItem.querySelector(".card");
    if (block.valid) {
      invalidIndicator.style.border = "4px solid green";
    } else {
      invalidIndicator.style.border = "4px solid red";
    }

    // Add event listener to the editable input field
    const editableInput = blockItem.querySelector(".editable");
    editableInput.addEventListener("input", function (event) {
      const updatedData = event.target.value;
      block.data = updatedData;
      block.valid = false; 
    });

    // Add event listener to the "Save" button
    const saveButton = blockItem.querySelector(".save-button");
    saveButton.addEventListener("click", function () {
      blockchain.notValid(block);
      getBlocks(blockchain.chain);
    });

    // Add event listener to the "Mine" button
    const mineButton = blockItem.querySelector('.mine-button');
    mineButton.addEventListener('click', async function(){
      await blockchain.mineBlock(block)
      getBlocks(blockchain.chain);
    });
  });
}