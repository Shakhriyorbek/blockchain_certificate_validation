// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string courseName;
        uint256 issueDate;
        address issuer;
        bool isValid;
    }

    mapping(bytes32 => Certificate) public certificates;
    address public owner;

    event CertificateIssued(bytes32 certHash, string studentName, string courseName, uint256 issueDate);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function issueCertificate(string memory studentName, string memory courseName, uint256 issueDate)
        public
        onlyOwner
        returns (bytes32)
    {
        bytes32 certHash = keccak256(abi.encodePacked(studentName, courseName, issueDate));
        certificates[certHash] = Certificate(studentName, courseName, issueDate, msg.sender, true);

        emit CertificateIssued(certHash, studentName, courseName, issueDate);
        return certHash;
    }

    function verifyCertificate(bytes32 certHash)
        public
        view
        returns (string memory, string memory, uint256, address, bool)
    {
        Certificate memory cert = certificates[certHash];
        return (cert.studentName, cert.courseName, cert.issueDate, cert.issuer, cert.isValid);
    }
}
