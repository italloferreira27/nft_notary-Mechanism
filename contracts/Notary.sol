// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Notary is ERC721, Ownable {

    // Proprietário do Notary
    address public notaryOwner;

    // Contador para o ID dos tokens do NFT e transferências
    uint256 private _tokenIds;
    uint256 private _transferIds;
    uint256 private _mintIds;

    // Estrutura para armazenar informações da transferência
    struct NFTTransfer {
        address nftContract;       // Endereço do contrato do NFT
        address sender;            // Endereço do remetente
        address receiverOnChain;   // Endereço que recebe na mesma rede (notaryOwner)
        address receiverInterChain; // Endereço que receberá na outra rede
        uint256 tokenId;           // ID do token NFT
        uint256 transferId;        // ID único da transferência
    }

    struct MintRecord {
        address sender;     // Quem solicitou o mint
        address receiver;   // Destinatário do NFT mintado
        uint256 tokenId;    // ID do token NFT
        uint256 mintId;     // ID único do mint
    }

    MintRecord[] public mintRecords;

    // Lista de todas as transferências de NFT
    NFTTransfer[] public nftTransfers;

    // Evento para registrar uma transferência inter-chain
    event NFTTransferInterChain(
        address indexed nftContract,
        address indexed sender,
        address indexed receiverOnChain,
        address receiverInterChain,
        uint256 tokenId,
        uint256 transferId
    );

    event NFTMinted(
        address indexed sender,
        address indexed receiver,
        uint256 indexed tokenId,
        uint256 mintId
    );

    // Evento para registro de um novo NFT mintado
    // event NFTMinted(address indexed to, uint256 indexed tokenId);

    // Construtor define o nome e símbolo do NFT e define o proprietário do contrato
    constructor() ERC721("NotaryNFT", "NTY") Ownable(msg.sender) {
        notaryOwner = msg.sender;
    }

    // Função para receber e transferir um NFT, mantendo as informações e enviando para outra rede
    function transferNFTInterChain(
        address nftContract,
        uint256 tokenId,
        address receiverInterChain
    ) external {
        // Verifica se o contrato é compatível com o padrão ERC721
        IERC721 token = IERC721(nftContract);

        // Transfere o NFT da conta do remetente para o proprietário do contrato (notaryOwner)
        token.transferFrom(msg.sender, notaryOwner, tokenId);

        // Incrementa o ID da transferência
        _transferIds++;

        // Armazena as informações da transferência
        NFTTransfer memory newTransfer = NFTTransfer({
            nftContract: nftContract,
            sender: msg.sender,
            receiverOnChain: notaryOwner,
            receiverInterChain: receiverInterChain,
            tokenId: tokenId,
            transferId: _transferIds
        });

        nftTransfers.push(newTransfer);

        // Emite o evento de transferência
        emit NFTTransferInterChain(
            nftContract,
            msg.sender,
            notaryOwner,
            receiverInterChain,
            tokenId,
            _transferIds
        );
    }

     function mintNFT(address to, address senderInterChain) external onlyOwner returns (uint256) {
        _tokenIds++;
        _mintIds++;
        uint256 newItemId = _tokenIds;

        // Mintar o novo token para o endereço especificado
        _mint(to, newItemId);

        // Armazenar as informações do mint
        MintRecord memory newMintRecord = MintRecord({
            sender: senderInterChain,
            receiver: to,
            tokenId: newItemId,
            mintId: _mintIds
        });

        mintRecords.push(newMintRecord);

        // Emite um evento de registro
        emit NFTMinted(senderInterChain, to, newItemId, _mintIds);

        return newItemId;
    }


    // Função para visualizar o proprietário do contrato (Notary Owner)
    function getNotaryOwner() external view returns (address) {
        return notaryOwner;
    }

    // Função para obter as transferências realizadas
    function getTransferById(uint256 transferId) external view returns (NFTTransfer memory) {
        require(transferId > 0 && transferId <= _transferIds, "Transfer ID invalido");
        return nftTransfers[transferId - 1];
    }

    function getNftTransfers() external view returns (uint256) {
        return nftTransfers.length;
    }
}
