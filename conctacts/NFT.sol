// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Mapping from token ID to packed status
    mapping(uint256 => bool) private _packedTokens;

    // Event emitted when a token is packed or unpacked
    event TokenPacked(uint256 indexed tokenId, bool packed);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {
        _nextTokenId = 1; // Inicializa o ID do token com 1
    }

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 newItemId = _nextTokenId;
        _nextTokenId += 1;
        _mint(to, newItemId);
        return newItemId;
    }

    function packToken(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "PackableERC721: caller is not token owner nor approved");
        require(!_packedTokens[tokenId], "PackableERC721: token is already packed");
        _packedTokens[tokenId] = true;
        emit TokenPacked(tokenId, true);
    }

    function unpackToken(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "PackableERC721: caller is not token owner nor approved");
        require(_packedTokens[tokenId], "PackableERC721: token is not packed");
        _packedTokens[tokenId] = false;
        emit TokenPacked(tokenId, false);
    }

    function isPacked(uint256 tokenId) public view returns (bool) {
        return _packedTokens[tokenId];
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    // function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override {
    //     super._beforeTokenTransfer(from, to, tokenId);
    //     require(!_packedTokens[tokenId], "PackableERC721: packed tokens cannot be transferred");
    // }
}
