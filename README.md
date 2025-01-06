# nft_notary-Mechanism

## Execução

* Instale as dependências do projeto:
```bash
npm install
```
* Preencha o arquivo `.env` com as chaves privadas das contas que serão utilizadas para efetuar as transações e com as URLs dos nós das redes.


* Inicialmente é preciso fazer os deploys nas duas redes de teste, tanto na amoy quanto na arbitrum:
```bash
npx hardhat run scripts/deploy.js --network avalanche
npx hardhat run scripts/deploy.js --network amoy
```

* Depois executar os scripts para efetuar a interoperação, sendo respectivamente o 1° da rede amoy para Fuji e o 2° da fuji para amoy:
```bash
npx hardhat run scripts/notaryTransferAmoy.js 
npx hardhat run scripts/notaryTransferAvalanche.js 
```