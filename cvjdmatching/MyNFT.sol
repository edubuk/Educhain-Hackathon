// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage{

    uint256 private currTokenId;

    constructor() ERC721("Edubuk","EDUBK"){}

    mapping(address=>uint256[]) private TokenIds; // mapping to store token ids of a user;

    event NFTBurned(address indexed owner, uint256 tokenId);

    // function to min nft;
    function mintMyNFT(address to, string[] memory tokenURIs) external
    {
        uint256 len = tokenURIs.length;
        require(to != address(0), "Invalid address");
        require(len > 0, "No URIs provided");
        for (uint256 i = 0; i < len; ++i) {
            currTokenId++;
            _safeMint(to, currTokenId); // function from ERC721 contract
            _setTokenURI(currTokenId , tokenURIs[i]); // function from ERC721URIStorage contract
            TokenIds[to].push(currTokenId);
        }
    }

    // function to burn nft;
    function burnNFT(uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        require(msg.sender == owner, "You are not the owner of this token.");
        _burn(tokenId);
        emit NFTBurned(owner, tokenId);
    }


    // function to get tokenIds
    function getTokenIds(address user) external view returns (uint256[] memory){
        require(user != address(0), "Invalid address");
        require(TokenIds[user].length > 0, "No tokenIds found for the user.");
        return TokenIds[user];
    }

}