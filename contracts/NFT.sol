// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract NFT is ERC721, Ownable, ERC721Holder {
    uint256 private _nextTokenId;
    uint256 public transferInterId;
    uint256 public lastTransferID;

    mapping(uint256 => bool) private _packedTokens;
    mapping(uint256 => address) private _tokenRecipients;

    event TokenPacked(uint256 indexed tokenId, bool packed);
    event TransferEvent(uint256 indexed tokenID, address indexed sender, address indexed receiver);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 newItemId = _nextTokenId;
        _nextTokenId += 1;

        // require(!_packedTokens[newItemId], "NFT: Packed tokens cannot be transferred");

        _mint(to, newItemId);
        return newItemId;
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(!_packedTokens[tokenId], "NFT: Packed tokens cannot be transferred");
        super.transferFrom(from, to, tokenId);
    }

    function transferInter(uint256 tokenId, address recipient) external {
        require(ownerOf(tokenId) == msg.sender, "NFT: Only the owner can transfer");
        require(getApproved(tokenId) == address(this) || isApprovedForAll(msg.sender, address(this)), "NFT: Contract is not approved to transfer this token");
        
        // Store the recipient address
        _tokenRecipients[tokenId] = recipient;

        // Transfer token to the contract
        safeTransferFrom(msg.sender, address(this), tokenId);

        emit TransferEvent(tokenId, msg.sender, recipient);
    }

    function withdraw(uint256 tokenId) external {
        address recipient = _tokenRecipients[tokenId];
        require(recipient != address(0), "NFT: No recipient set for this token");
        require(msg.sender == recipient, "NFT: Only the designated recipient can withdraw this token");

        require(getApproved(tokenId) == address(this) || isApprovedForAll(address(this), address(this)), "NFT: Contract is not approved to transfer this token");

        // Clear the recipient address
        delete _tokenRecipients[tokenId];

        // Transfer token to the recipient
        safeTransferFrom(address(this), recipient, tokenId);
    }
}