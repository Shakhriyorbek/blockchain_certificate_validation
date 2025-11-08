// ==== Configuration ====
// Replace this with your contract address after deployment
const contractAddress = "PASTE_YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";

let provider, signer, contract;

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, window.contractABI, signer);
    alert("✅ MetaMask connected!");
  } else {
    alert("Please install MetaMask!");
  }
}

async function issueCertificate() {
  if (!contract) return alert("Please connect MetaMask first!");

  const student = document.getElementById("student").value;
  const course = document.getElementById("course").value;

  if (!student || !course) return alert("Please fill in both fields!");

  const issueDate = Math.floor(Date.now() / 1000); // current UNIX timestamp

  try {
    const tx = await contract.issueCertificate(student, course, issueDate);
    await tx.wait();
    document.getElementById("result").textContent =
      "✅ Certificate issued! Tx: " + tx.hash;
  } catch (err) {
    console.error(err);
    alert("Error issuing certificate: " + err.message);
  }
}

async function verifyCertificate() {
  if (!contract) return alert("Please connect MetaMask first!");

  const hash = document.getElementById("hash").value.trim();
  if (!hash) return alert("Enter certificate hash");

  try {
    const data = await contract.verifyCertificate(hash);
    if (data[0] === "") {
      document.getElementById("result").textContent =
        "❌ Certificate not found or invalid.";
    } else {
      document.getElementById("result").textContent = `
✅ Certificate Found:
Student: ${data[0]}
Course: ${data[1]}
Issued: ${new Date(data[2] * 1000).toLocaleString()}
Issuer: ${data[3]}
Valid: ${data[4]}
`;
    }
  } catch (err) {
    console.error(err);
    alert("Error verifying certificate: " + err.message);
  }
}

// ==== Bind UI buttons ====
document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("issueButton").addEventListener("click", issueCertificate);
document.getElementById("verifyButton").addEventListener("click", verifyCertificate);
