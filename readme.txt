# Blockchain Project

## Start Ganache
```bash
cd /Users/kaanduzbastilar/Documents/GitHub/blockchain_certificate_validation
npx ganache -p 7545 -h 127.0.0.1 --chain.chainId 1337 \
  --wallet.mnemonic # do not change account details
```

## Deploy Contract for Ganache
```bash
cd /Users/kaanduzbastilar/Documents/GitHub/blockchain_certificate_validation
npx truffle compile
npx truffle migrate --reset --network development
```

## Frontend Server
```bash
cd /Users/kaanduzbastilar/Documents/GitHub/blockchain_certificate_validation/frontend
npx http-server -c-1 -p 8080
```

## Add Network to MetaMask
- Network name: Ganache Local
- RPC URL: http://127.0.0.1:7545 or http://localhost:7545
- Chain ID: 1337
- Currency symbol: ETH

---

## Ganache GUI for Mac (outdated, requires Homebrew)
```bash
brew install --cask ganache
```

---

# Anvil Setup (Recommended for macOS)

## Install Foundry
```bash
brew install foundry
```

## Start Anvil
```bash
anvil
```

## Connect MetaMask to Anvil Network
- Network Name: Anvil Local
- RPC URL: http://127.0.0.1:8545 or http://localhost:8545  # localhost works better (DNS bug)
- Chain ID: 31337
- Currency Symbol: ETH

## Deploy Contract for Anvil
```bash
cd /Users/kaanduzbastilar/Documents/GitHub/blockchain_certificate_validation
npx truffle compile # if necessary
npx truffle migrate --reset --network anvil
```

---

# Send ETH Between Accounts
Via MetaMask → Send (pick account based on terminal output)

---

# Browser Console Method Check
```javascript
ethereum.request({ method: "eth_chainId" }).then(console.log)
```

# Console Balance Check
```bash
npx truffle console --network anvil
# or
npx truffle console --network development
```

Inside console:
```javascript
(async () => {
  let a = await web3.eth.getAccounts();
  for (let i in a) {
    console.log(i, a[i], web3.utils.fromWei(await web3.eth.getBalance(a[i]), "ether"));
  }
})();
```