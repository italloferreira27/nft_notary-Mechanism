// contracts/MyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable{
    uint256 private _nextTokenId;
    constructor() ERC721("MyToken", "MTK") Ownable(msg.sender){
    }

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 newItemId = _nextTokenId++;

        _mint(to, newItemId);
        return newItemId;
    }
}