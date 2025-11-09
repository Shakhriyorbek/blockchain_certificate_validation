// truffle-config.js
module.exports = {
  networks: {
    // 🚀 Lokal geliştirme ağı (Ganache)
    development: {
      host: "127.0.0.1",   // Lokal IP
      port: 7545,          // Ganache varsayılan portu
      network_id: "*",     // Tüm ağ ID'leriyle eşleşir
    },
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.21",   // Kontratındaki pragma ile aynı olmalı
      // settings: { optimizer: { enabled: true, runs: 200 } }
    },
  },
};