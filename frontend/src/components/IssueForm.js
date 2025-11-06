import { useState } from "react";
import { ethers } from "ethers";
import CertificateRegistry from "../artifacts/contracts/CertificateRegistry.json";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function IssueForm() {
  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("");

  const issueCert = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, CertificateRegistry.abi, signer);
    const date = Math.floor(Date.now() / 1000);
    const tx = await contract.issueCertificate(student, course, date);
    await tx.wait();
    alert("Certificate issued successfully!");
  };

  return (
    <div className="p-4">
      <input placeholder="Student Name" onChange={e => setStudent(e.target.value)} />
      <input placeholder="Course Name" onChange={e => setCourse(e.target.value)} />
      <button onClick={issueCert}>Issue Certificate</button>
    </div>
  );
}

export default IssueForm;
