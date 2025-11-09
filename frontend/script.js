// ==== Configuration ====
// Truffle console'da: let i = await CertificateRegistry.deployed(); i.address
const contractAddress = "contract-adress";

let provider, signer, contract, iface;

async function refreshSignerAndContract() {
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  contract = new ethers.Contract(contractAddress, window.contractABI, signer);
  iface = new ethers.Interface(window.contractABI);
}

function attachEthereumListeners() {
  if (!window.ethereum || window._listenersAttached) return;
  window.ethereum.on('accountsChanged', async (accounts) => {
    try {
      await refreshSignerAndContract();
      const me = await signer.getAddress();
      const own = await contract.owner().catch(() => null);
      setResult(`🔄 Account changed: ${me}${own ? `\nOwner: ${own}\nOwner? ${me.toLowerCase()===own.toLowerCase()}` : ""}`);
    } catch (e) {
      console.error(e);
      setResult(`accountsChanged error: ${e.message || e}`);
    }
  });
  window.ethereum.on('chainChanged', (_chainId) => {
    // Full reload is recommended by MetaMask on chain change
    location.reload();
  });
  window._listenersAttached = true;
}

function setResult(objOrText) {
  const el = document.getElementById("result");
  if (typeof objOrText === "string") {
    el.textContent = objOrText;
  } else {
    el.textContent = JSON.stringify(objOrText, null, 2);
  }
}

async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    // Ensure listeners are attached once
    attachEthereumListeners();

    // Ask MetaMask to let you choose the account explicitly
    // (shows the connect dialog again)
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }]
    }).catch(() => { /* ignore if user rejects; we'll still try requestAccounts */ });

    const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
    // Accept common local ids (1337/5777); warn otherwise
    const localOk = chainIdHex === "0x539" || chainIdHex === "0x1691";
    if (!localOk) {
      setResult(`⚠️ Wrong network (chainId=${chainIdHex}). Select Localhost 7545 in MetaMask and retry.`);
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    await refreshSignerAndContract();

    const me = await signer.getAddress();
    const own = await contract.owner().catch(() => null);
    const code = await provider.getCode(contractAddress);
    const hasCode = code && code !== "0x";

    setResult(
      `✅ Connected as ${me}\n` +
      `ChainId: ${parseInt(chainIdHex, 16)} (${chainIdHex})\n` +
      `Contract: ${contractAddress}\n` +
      `HasCode: ${hasCode}\n` +
      (own ? `Owner: ${own}\nOwner? ${me.toLowerCase()===own.toLowerCase()}` : "")
    );

    if (!hasCode) {
      console.warn("No contract code at the given address on this chain.");
    }
  } catch (e) {
    console.error(e);
    setResult(`Connect error: ${e.message || e}`);
  }
}

async function issueCertificate() {
  try {
    if (!contract) return alert("Please connect MetaMask first!");
    const student = document.getElementById("student").value.trim();
    const course  = document.getElementById("course").value.trim();
    if (!student || !course) return alert("Please fill in both fields!");

    const issueDate = Math.floor(Date.now() / 1000); // seconds
    const tx = await contract.issueCertificate(student, course, issueDate);
    const receipt = await tx.wait();

    // Event'ten certHash'i yakala
    let certHash = null;
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === "CertificateIssued") {
          certHash = parsed.args.certHash;
          break;
        }
      } catch (_) { /* farklı log olabilir, geç */ }
    }

    setResult({
      message: "✅ Certificate issued",
      txHash: receipt.transactionHash,
      certHash: certHash || "(event not parsed)",
    });
  } catch (e) {
    console.error(e);
    setResult(`Issue error: ${e.message || e}`);
  }
}

async function verifyCertificate() {
  try {
    if (!contract) return alert("Please connect MetaMask first!");
    const hash = document.getElementById("hash").value.trim();
    if (!hash) return alert("Enter certificate hash");

    // Basit bytes32 doğrulaması
    if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) {
      return alert("Invalid bytes32 (0x + 64 hex).");
    }

    const data = await contract.verifyCertificate(hash);
    // data: [name, course, issueDate(BigInt), issuer, exists]
    const issueDate = Number(data[2]); // BigInt -> Number (safe: epoch seconds)
    const resultObj = {
      found: data[0] !== "",
      name: data[0],
      course: data[1],
      issueDate,
      issueDateISO: new Date(issueDate * 1000).toISOString(),
      issuer: data[3],
      valid: Boolean(data[4]),
    };
    setResult(resultObj);
  } catch (e) {
    console.error(e);
    setResult(`Verify error: ${e.message || e}`);
  }
}

// ==== Bind UI buttons ====
document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("issueButton").addEventListener("click", issueCertificate);
document.getElementById("verifyButton").addEventListener("click", verifyCertificate);

// Try to attach listeners immediately if ethereum is present
if (window.ethereum) {
  attachEthereumListeners();
}
