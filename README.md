# nft_notary-Mechanism

## Execução

* Instale as dependências do projeto:
```bash
npm install
```
* Preencha o arquivo `.env` com as chaves privadas das contas que serão utilizadas para efetuar as transações e com as URLs dos nós das redes.


* Inicialmente é preciso fazer os deploys nas duas redes de teste, tanto na amoy quanto na sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat run scripts/deploy.js --network amoy
```

* Depois executar o transfer.js, para efetuar a interoperação:
```bash
npx hardhat run scripts/transfer.js
```