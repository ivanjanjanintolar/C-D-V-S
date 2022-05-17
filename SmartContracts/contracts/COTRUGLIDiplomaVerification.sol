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
        approvedAddressesMapping[_toApprove].isApproved = true;
    }

    function removeApprovedAddress(address _toRemove) public isOwner {
        approvedAddressesMapping[_toRemove].isApproved = false;
    }
    
    function startSignatures(string memory _digitalFingerprint) public {
        require(approvedAddressesMapping[msg.sender].isApproved == true, 'This address is not approved to evoke this function');
        require(diplomasMapping[_digitalFingerprint].exists == false);
        diplomasMapping[_digitalFingerprint].exists = true;
        diplomasMapping[_digitalFingerprint].lastUpdated = block.timestamp;
    }
	
	
    function verifyDiploma(string memory _digitalFingerprint) public view returns(bool _confirmed, uint _timestamp) {
        if (diplomasMapping[_digitalFingerprint].exists == true){
            return (_confirmed = true, diplomasMapping[_digitalFingerprint].lastUpdated);
        } else  {
            return (_confirmed = false, diplomasMapping[_digitalFingerprint].lastUpdated);
        }
    }
	
	 function removeContract() public isOwner {
        selfdestruct(msg.sender);
    }
    
}