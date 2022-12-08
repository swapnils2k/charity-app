//SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/utils/Strings.sol";


pragma solidity >=0.4.22 <0.9.0;
//pragma experimental ABIEncoderV2;

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


//pragma solidity >=0.7.0 <0.9.0;
contract CharityApp {

    address public erc20tokenAddress;
    
    constructor() public{
        contractAddress = msg.sender;// admin who is deploying the smart contract.
    }
    address public contractAddress;
    enum Role {Organization, Donor, Beneficiary}
    enum ApprovalForm {Init, Approve, Reject, VotesAcheived, Release, VotingStart, VotingEnd, VotesNotAcheived}
    struct Organization{
        address Address;// unique Address of the organization
        string Certificate;//TO check if he is a legitimate customer or not
        string Name;
        ApprovalForm Status;
        uint Balance;//to display the total balance of the organization.
        bool Exists;// if the exist they won't be able to register again.
        // yet to add other attributes for organization.
    }
   // Organization[] organization; // IN ORDER TO  GET ALL THE ORGANIZATIONS VIEW
    struct Donor {
        address Address;
        string Name;
        uint Amount;
        address[] Beneficiaries;
        bool Exists;
    }
    //MY CODE
    struct Beneficiary {
        address Address;
        address OrgAddress;
        uint Amount;
        string Name;
        ApprovalForm Status;
        bool Exists;
        uint Votes;
    }

    uint thresholdVotes = 3;
    uint minimumDonation = 10;

    mapping(address => Beneficiary) public registeredBen;
    mapping(address => Organization) public registeredOrg;
    mapping(address => Donor) public registeredDonor;
    
    function setTokenAddress(address addr) public {
        erc20tokenAddress = addr;
    }

    function beneSignUp(string memory name, uint amount, address orgAddress) checkOrgExists(orgAddress) public {
        if(!registeredBen[msg.sender].Exists) {
            registeredBen[msg.sender] = Beneficiary({
                Address: msg.sender,
                OrgAddress: orgAddress,
                Amount: amount,
                Name: name,
                Status: ApprovalForm.Init,
                Exists: true,
                Votes: 0
            });
        }
    }

    //benificary should also have approval form
    function orgSignUp(string memory name, string memory certificate) public{
        if(!registeredOrg[msg.sender].Exists) {
            registeredOrg[msg.sender] =Organization({// if the organization dosent exist we are creating a object(i.e value) with 
            //reference to key i.e address --> msg.sender.
                   // organization.push(Organization( {
                    Address: msg.sender,
                    Certificate: certificate,
                    Name:name,
                    Status: ApprovalForm.Init,
                    Balance: IERC20(erc20tokenAddress).balanceOf(msg.sender),
                    Exists: true
            });
        }
    }

    modifier checkDonorExists(address donorAddress) {
        require(registeredDonor[donorAddress].Exists, "Invalid Donor Addresss.");
        _;
    }

    function donorSignUp(string memory name) public {
        if(!registeredDonor[msg.sender].Exists) {// similar to organization we are also setting it up with donor
            address[] memory emptyAddreses;
            registeredDonor[msg.sender] = Donor(
                {
                    Address: msg.sender,
                    Amount: IERC20(erc20tokenAddress).balanceOf(msg.sender),
                    Name: name,
                    Beneficiaries: emptyAddreses,
                    Exists: true
            });
        }
    }
    //validating if its admin or not.
    modifier checkIfAdmin() {
        require(msg.sender == contractAddress, "Invalid Access.");
        _;
    }

    // check if admin address is contract deployed address
    function adminSignUp() checkIfAdmin() public view returns(address) {
            return msg.sender; // FOR DEBUGGING I HAVE PUT.
    }
    //validating organization addr as a key we are checkingt if he already exists or not.
    modifier checkOrgExists(address orgAddress) {
        require(registeredOrg[orgAddress].Exists, "Invalid Org Addresss.");
        _;
    }
    // updaitng the status of organization to approve or reject by admin approve/reject.
    function orgStatusUpdate(address orgAddress, ApprovalForm status) 
        checkIfAdmin() checkOrgExists(orgAddress) public {
        registeredOrg[orgAddress].Status = status;
    }

    modifier checkRole(Role role) {
        if (role == Role.Donor) {
            require(registeredDonor[msg.sender].Exists, "Invalid Access!!");
        }
        _;
    }

    modifier checkOrgStatus(address  orgAddress, ApprovalForm  status) {
        require(registeredOrg[orgAddress].Status == status, "Invalid Access!!");
        _;
    }
    modifier checkBeneStatus(address beneAddress, ApprovalForm status) {
        if (beneAddress !=address(0)){
            require(registeredBen[beneAddress].Status == status,"Invalid Beneficiary status!!");
        }
        _;
    }

    modifier checkMinimumDonationAmt(uint amount) {
        string memory errMsg = string(abi.encodePacked("Invalid donation amount should be atleast ", Strings.toString(minimumDonation)));
        require(amount >= minimumDonation, errMsg);
        _;
    }

    modifier checkDonateBeneStatus(address beneAddress) {
        if (beneAddress !=address(0)){
            ApprovalForm currStatus = registeredBen[beneAddress].Status;
            require(currStatus == ApprovalForm.VotingStart, "Invalid Beneficiary status!!");
            bool found = false;
            for (uint256 i=0; i<registeredDonor[msg.sender].Beneficiaries.length; i++) {
                if (registeredDonor[msg.sender].Beneficiaries[i] == beneAddress) {
                    found = true;
                    break;
                }
            }
            require(!found, "Invalid multiple votings for the same beneficiary is not allowed");
        }
        _;
    }

    // bytes20ToLiteralString converts address or bytes20 to string 
    function bytes20ToLiteralString(bytes20 data) private pure returns (string memory result) {
        bytes memory temp = new bytes(41);
        uint256 count;
        for (uint256 i = 0; i < 20; i++) {
            bytes1 currentByte = bytes1(data << (i * 8));    
            uint8 c1 = uint8(
                bytes1((currentByte << 4) >> 4)
            );
            uint8 c2 = uint8(
                bytes1((currentByte >> 4))
            );
            if (c2 >= 0 && c2 <= 9) temp[++count] = bytes1(c2 + 48);
            else temp[++count] = bytes1(c2 + 87);
            
            if (c1 >= 0 && c1 <= 9) temp[++count] = bytes1(c1 + 48);
            else temp[++count] = bytes1(c1 + 87);
        }
        result = string(temp);
    }

    // function for donors to donate to orgAddr and we are chekcing if role is donor, org exist, if org has approved or not
    // and if donor exists. If everything is accepted we push the trsaction from donor to org and each trasaction is stored in array
    // getAddress from and to we are encrpting with their roles at the end. 
    // are storing total amount trasfered by the donor as well as total amount received by the org.
    function donate(address  orgAddress, address beneAddress, uint amount) checkRole(Role.Donor) checkOrgExists(orgAddress) 
        checkOrgStatus(orgAddress, ApprovalForm.Approve) checkDonorExists(msg.sender) 
        checkDonateBeneStatus(beneAddress) checkMinimumDonationAmt(amount) public {
       // orgAddress.transfer(msg.value);
        IERC20(erc20tokenAddress).transferFrom(msg.sender, orgAddress, amount);

        registeredDonor[msg.sender].Amount += uint248(amount);
        registeredOrg[orgAddress].Balance += uint248(amount);
        if (beneAddress != address(0)) {
            registeredBen[beneAddress].Votes += 1;
            registeredDonor[msg.sender].Beneficiaries.push(beneAddress);
        }
    }

    modifier checkBeneExists(address beneAddress, address orgAddress) {
        require(registeredBen[beneAddress].Exists, "Invalid Beneficiary!!");
        require(registeredBen[beneAddress].OrgAddress == orgAddress, "Invalid Beneficiary!!");
        _;
    }

    modifier checkStatusFlow(address beneAddress, ApprovalForm status) {
        ApprovalForm currStatus = registeredBen[beneAddress].Status;
        if (status == ApprovalForm.Approve || status == ApprovalForm.Reject) {
            require(currStatus == ApprovalForm.Init, "Invalid beneficiary status.");
        } else if (status == ApprovalForm.VotingStart) {
            require(currStatus == ApprovalForm.Approve, "Invalid beneficiary status.");
        } else if (status == ApprovalForm.VotingEnd) {
            require(currStatus == ApprovalForm.VotingStart, "Invalid beneficiary status.");
        }
        _;
    }

    function beneUpdateStatus(address beneAddress, ApprovalForm status) 
        checkOrgExists(msg.sender) checkBeneExists(beneAddress, msg.sender)
        checkStatusFlow(beneAddress, status) public {
        registeredBen[beneAddress].Status = status;
        if (status == ApprovalForm.VotingEnd) {
            if (registeredBen[beneAddress].Votes >= thresholdVotes) {
                registeredBen[beneAddress].Status = ApprovalForm.VotesAcheived;
            } else {
                registeredBen[beneAddress].Status = ApprovalForm.VotesNotAcheived;
            }
        }
    }

    modifier validateAmount(address beneAddress,uint amount) {
        require(registeredBen[beneAddress].Amount == uint248(amount), "Invalid Amount!!");// this is the amt i am giving to the bene and it should be equal
        require(registeredOrg[msg.sender].Balance >= uint248(amount), "Insufficient funds!!"); // funds in. the org should be more than he is transfering to the beneficary.
        _;
    }

    function releaseFunds(address  beneAddress, uint amount) 
        checkBeneExists(beneAddress, msg.sender) checkBeneStatus(beneAddress, ApprovalForm.VotesAcheived) 
        validateAmount(beneAddress,amount) public  {
        //beneAddress.transfer(msg.value);
        IERC20(erc20tokenAddress).transferFrom(msg.sender, beneAddress, amount);
        registeredBen[beneAddress].Status = ApprovalForm.Release;
        registeredOrg[msg.sender].Balance -= uint248(amount);
    }

}