// Подключаемся к контракту
// const contractAddress = "0x4c8dC10DED054C12315fd6D2Ac1987ce4618bF81";
const contractAddress = "0xaBaaa716E9EFADfbfB47Eb71d1Fb7AF7A7e9C719";

let signer = null;
let contract = null;
let account = null;
let choice = null;
let allLobbies = null;

function showError(message) {
  Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonText: 'OK'
  })
}

function showSuccess(message) {
  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK'
  })
}

function displayLobbies(lobbies) {
  let tableBody = document.getElementById("tableBody");

  tableBody.innerHTML = `
    <tr>
      <th class="px-6 py-3 text-lg font-medium text-left text-gray-500 uppercase" scope="col">Game Id</th>
      <th class="px-6 py-3 text-lg font-medium text-left text-gray-500 uppercase" scope="col">Deposit</th>
      <th class="px-6 py-3 text-lg font-medium text-right text-gray-500 uppercase" scope="col">Action</th>
    </tr>
  `;

  lobbies.forEach(lobby => {
    let newRow = document.createElement("tr");
    newRow.classList.add("hover:bg-gray-100");

    newRow.innerHTML = `
      <td class="px-6 py-4 text-base font-medium text-gray-800">${lobby.id}</td>
      <td class="px-6 py-4 text-base font-medium text-gray-800">${lobby.deposit}</td>
      <td class="px-6 py-4 text-base font-medium text-right">
        <a class="text-blue-500 hover:text-blue-700" href="/choose-figure.html?gameid=${lobby.id}&deposit=${lobby.deposit}">Connect</a>
      </td>
    `;
    tableBody.appendChild(newRow);
  });
}

function applyFilters() {
  let minDeposit = parseInt(document.getElementById("minDeposit").value);
  let maxDeposit = parseInt(document.getElementById("maxDeposit").value);
  
  let lobbiesToDisplay = allLobbies.filter(lobby => lobby.deposit >= minDeposit && lobby.deposit <= maxDeposit);
  displayLobbies(lobbiesToDisplay);
}

function clearFilters() {
  document.getElementById("minDeposit").value = 0;
  document.getElementById("maxDeposit").value = 0;

  displayLobbies(allLobbies);
}

async function loadAllLobbies() {
  if (contract) {
    try {
      const receipt = await contract.getWaitingGames();
      
      allLobbies = new Array();
      receipt.forEach(element => {
        allLobbies.push({
          id: ethers.utils.hexZeroPad(element[0].toHexString(), 32),
          deposit: element[1] * 0.000000001,
        })
      });
      return true;
    } catch (error) {
      if (error.message == "Internal JSON-RPC error.")
        showError(error.data.message);
      else
        showError(error.message);
    }
  } else {
    showError("Please, connect a MetaMask wallet.");
  }

  return false;
}

async function connectWallet() {
  // Проверяем, доступен ли MetaMask провайдер
  if (typeof window.ethereum !== "undefined") {
    try {
      // Запрашиваем разрешение на подключение к аккаунту MetaMask
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      account = accounts[0];

      const provider = new ethers.providers.Web3Provider(window.ethereum, 97);
      provider.on('accountsChanged', function (accounts) {
        account = accounts[0];
      });

      signer = provider.getSigner(account);
      contract = new ethers.Contract(contractAddress, abi, signer);
    } catch (error) {
      if (error.message == "Internal JSON-RPC error.")
        showError(error.data.message);
      else
        showError(error.message);
    }
  } else {
    showError("MetaMask not found.");
  }
  
  if (contract) {
    document.getElementById("connectWalletBtn").classList.add("hidden");
    return true;
  }

  document.getElementById("connectWalletBtn").classList.remove("hidden");
  return false;
}

async function createLobby() {
  // Проверяем, был ли подключен аккаунт MetaMask
  if (contract == null) {
    showError("Please, connect a MetaMask wallet.");
    return false;
  }

  if (choice == null) {
    showError("Choose your figure.");
    return false;
  }

  const value = document.getElementById("deposit").value;

  try {
    const options = { value: ethers.utils.parseUnits(value, 'gwei') }
    const receipt = await contract.createGame(choice, options);
  } catch (error) {
    if (error.message == "Internal JSON-RPC error.")
      showError(error.data.message);
    else
      showError(error.message);
    return false;
  }

  return true;
}

async function joinLobby(gameid) {
  // Проверяем, был ли подключен аккаунт MetaMask
  if (contract == null) {
    showError("Please, connect a MetaMask wallet.");
    return false;
  }

  if (choice == null) {
    showError("Choose your figure.");
    return false;
  }
  
  const value = document.getElementById("deposit").value;
      
  try {
    const options = { value: ethers.utils.parseUnits(value, 'gwei') }
    const receipt = await contract.joinGame(gameid, choice, options);
  } catch (error) {
    if (error.message == "Internal JSON-RPC error.")
      showError(error.data.message);
    else
      showError(error.message);
    return false;
  }

  return true;
}

async function getHistory() {
  if (contract) {
    try {
      return await contract.getGamesByAddress(account);
    } catch (error) {
      if (error.message == "Internal JSON-RPC error.")
        showError(error.data.message);
      else
        showError(error.message);
    }
  } else {
    showError("Please, connect a MetaMask wallet.");
  }

  return false;
}

function displayHistory(history) {

  let tableBody = document.getElementById("tableBody");

  tableBody.innerHTML = `
    <tr>
      <th class="px-6 py-3 text-lg font-medium text-left text-gray-500 uppercase" scope="col">Game Id</th>
      <th class="px-6 py-3 text-lg font-medium text-left text-gray-500 uppercase" scope="col">State</th>
      <th class="px-6 py-3 text-lg font-medium text-left text-gray-500 uppercase" scope="col">Player1</th>
      <th class="px-6 py-3 text-lg font-medium text-left text-gray-500 uppercase" scope="col">Player2</th>
      <th class="px-6 py-3 text-lg font-medium text-left text-gray-500 uppercase" scope="col">Player1 Choice</th>
      <th class="px-6 py-3 text-lg font-medium text-left text-gray-500 uppercase" scope="col">Player2 Choice</th>
      <th class="px-6 py-3 text-lg font-medium text-left text-gray-500 uppercase" scope="col">Deposit</th>
    </tr>
  `;

  let getStateName = (state) => {
    if (state == 0) return "Waiting For Players";
    else if (state == 1) return "Waiting For Move1";
    else if (state == 2) return "Waiting For Move2";
    else if (state == 3) return "Game Over";
  }

  history.forEach(game => {
    let newRow = document.createElement("tr");
    newRow.classList.add("hover:bg-gray-100");

    newRow.innerHTML = `
      <td class="px-6 py-4 text-base font-medium text-gray-800">${game.gameId}</td>
      <td class="px-6 py-4 text-base font-medium text-gray-800">${getStateName(game.state)}</td>
      <td class="px-6 py-4 text-base font-medium text-gray-800">${game.player1}</td>
      <td class="px-6 py-4 text-base font-medium text-gray-800">${game.player2}</td>
      <td class="px-6 py-4 text-base font-medium text-gray-800">${game.player1Choice}</td>
      <td class="px-6 py-4 text-base font-medium text-gray-800">${game.player2Choice}</td>
      <td class="px-6 py-4 text-base font-medium text-gray-800">${game.deposit * 0.000000001}</td>
    `;
    tableBody.appendChild(newRow);
  });
}

function selectRock() {
  choice = 0;
  
  document.getElementById("rock").checked = true;
  document.getElementById("paper").checked = false;
  document.getElementById("scissors").checked = false;

  document.getElementById("rockImg").classList.add("border-yellow-500");
  document.getElementById("rockImg").classList.remove("border-transparent");
  document.getElementById("paperImg").classList.add("border-transparent");
  document.getElementById("paperImg").classList.remove("border-yellow-500");
  document.getElementById("scissorsImg").classList.add("border-transparent");
  document.getElementById("scissorsImg").classList.remove("border-yellow-500");
}

function selectPaper() {
  choice = 1; 
  
  document.getElementById("rock").checked = false;
  document.getElementById("paper").checked = true;
  document.getElementById("scissors").checked = false;

  document.getElementById("rockImg").classList.add("border-transparent");
  document.getElementById("rockImg").classList.remove("border-yellow-500");
  document.getElementById("paperImg").classList.add("border-yellow-500");
  document.getElementById("paperImg").classList.remove("border-transparent");
  document.getElementById("scissorsImg").classList.add("border-transparent");
  document.getElementById("scissorsImg").classList.remove("border-yellow-500");
}

function selectScissors() {
  choice = 2;

  document.getElementById("rock").checked = false;
  document.getElementById("paper").checked = false;
  document.getElementById("scissors").checked = true;

  document.getElementById("rockImg").classList.add("border-transparent");
  document.getElementById("rockImg").classList.remove("border-yellow-500");
  document.getElementById("paperImg").classList.add("border-transparent");
  document.getElementById("paperImg").classList.remove("border-yellow-500");
  document.getElementById("scissorsImg").classList.add("border-yellow-500");
  document.getElementById("scissorsImg").classList.remove("border-transparent");
}

if (window.location.pathname == "/") {
  window.addEventListener("load", () => {
    document.getElementById("connectWalletBtn").addEventListener("click", () => connectWallet(), false);
    document.getElementById("applyFiltersBtn").addEventListener("click", () => applyFilters(), false);
    document.getElementById("clearFiltersBtn").addEventListener("click", () => clearFilters(), false);
    document.getElementById("createLobbyBtn").addEventListener("click", () => { location.href = "/choose-figure.html" }, false);
    
    connectWallet().then(status => {
      if (status)
        loadAllLobbies().then(status => {
          if (status)
            displayLobbies(allLobbies)
        });
    })
  }, false);
} else if (window.location.pathname == "/choose-figure.html") {
  window.addEventListener("load", () => {
    document.getElementById("connectWalletBtn").addEventListener("click", () => connectWallet(), false);
    
    document.getElementById("rockImg").addEventListener("click", selectRock, false);
    document.getElementById("paperImg").addEventListener("click", selectPaper, false);
    document.getElementById("scissorsImg").addEventListener("click", selectScissors, false);
    
    let url = new URL(window.location);
    let params = new URLSearchParams(url.search);
    
    if (params.has("gameid")) {
      let depositInput = document.getElementById("deposit");
      depositInput.value = params.get("deposit");
      depositInput.disabled = true;
      
      document.getElementById("playBtn").addEventListener("click", () => {        
        joinLobby(params.get("gameid")).then(status => { if (status) location.href = "/results.html"; });
      }, false);
    } else {
      document.getElementById("playBtn").addEventListener("click", () => {
        createLobby().then(status => { if (status) location.href = "/history.html"; });
      }, false);
    }
    
    connectWallet();
  }, false);
} else if (window.location.pathname == "/history.html") {
  window.addEventListener("load", () => {
    document.getElementById("connectWalletBtn").addEventListener("click", () => connectWallet(), false);
    document.getElementById("refreshHistoryBtn").addEventListener("click", () => getHistory().then(results => displayHistory(results)), false);

    connectWallet().then(status => {
      if (status)
        getHistory().then(results => {
          displayHistory(results)
        });
    })
  }, false);
}
