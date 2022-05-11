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
    }
    
    modifier isOwner() { if (msg.sender != owner) revert(); _; }

    struct Diploma {
        uint lastUpdated;
        bool exists;
    }
    
    mapping (string  => Diploma) diplomasMapping;
    
    function startSignatures(string memory digitalFingerprint) public {
        diplomasMapping[digitalFingerprint].exists = true;
        diplomasMapping[digitalFingerprint].lastUpdated = block.timestamp;
    }
	
	
		function verifyDiploma(string memory digitalFingerprint) public view returns(bool _confirmed, uint _timestamp) {
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