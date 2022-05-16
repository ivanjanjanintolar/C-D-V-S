/*
**   Signed Digital Asset - A contract to store signatures of digital assets.
**   COTRUGLI Business School
*/

// SPDX-License-Identifier: MIT
pragma solidity =0.7.0;

contract COTRUGLIDiplomaVerification {
    
    address owner;
    
    constructor() {
       owner = msg.sender;
       approveAddress(msg.sender);
    }
    
    modifier isOwner() { if (msg.sender != owner) revert(); _; }

    struct Diploma {
        uint lastUpdated;
        bool exists;
    }

    struct ApprovedAddresses{
        bool isApproved;
    }
    
    mapping (string  => Diploma) diplomasMapping;
    mapping (address => ApprovedAddresses) approvedAddressesMapping;

     function approveAddress(address _toApprove) public isOwner {
        approvedAddressesMapping[_personToApprove].isApproved = true;
    }

    function removeApprovedAddress(address _toRemove) public isOwner {
        approvedAddressesMapping[_personToRemove].isApproved = false;
    }
    
    function startSignatures(string memory _digitalFingerprint) public {
        require(approvedAddressesMapping[msg.sender].isApproved == true, 'This address is not approved to evoke this function');
        diplomasMapping[digitalFingerprint].exists = true;
        diplomasMapping[digitalFingerprint].lastUpdated = block.timestamp;
    }
	
	
    function verifyDiploma(string memory _digitalFingerprint) public view returns(bool _confirmed, uint _timestamp) {
        if (diplomasMapping[digitalFingerprint].exists == true){
            return (_confirmed = true, diplomasMapping[digitalFingerprint].lastUpdated);
        } else  {
            return (_confirmed = false, diplomasMapping[digitalFingerprint].lastUpdated);
        }
    }
	
	 function removeContract() public isOwner {
        selfdestruct(msg.sender);
    }
    
}