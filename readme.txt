Commands in CMD

Init Ganache
`npx ganache --port 7545`

Migrate truffle
`truffle migrate --reset`

Console
`truffle.console`

Test console
`let instance = await CertificateRegistry.deployed()
`let tx = await instance.issueCertificate("Alice", "Blockchain 101", 1730150400)
`tx.logs[0].args.certHash`

Check console
`await instance.verifyCertificate("hash")`