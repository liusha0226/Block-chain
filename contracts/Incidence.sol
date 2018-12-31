pragma solidity ^0.5.0;
contract Incidence {
	//声明一个参与者
	struct Participant{
		bool participated;
		bool isPatient;
	}

	//疾病类型
	struct Disease {
		uint name;
		uint allParticipantNum;
		uint patientNum;
		uint incidence;
	}

	address public publisher;
	mapping(address => Participant) public participants;
	Disease public disease;

	constructor() public {
		publisher = msg.sender;
		disease.allParticipantNum = 0;
		disease.patientNum = 0;
		disease.incidence = 0;
		disease.name = 777;
	}
	
	function participate(bool isPatient) public {
		Participant storage sender = participants[msg.sender];
		if (sender.participated) return;
		sender.participated = true;

		if (isPatient){
			sender.isPatient = true;
			disease.patientNum ++;
		}else{
			sender.isPatient = false;
		}
	
		disease.allParticipantNum ++;
		disease.incidence = disease.patientNum * 100 / disease.allParticipantNum;
	}

	function getIncidence() public view returns (uint incidenceOfDisease) {
		incidenceOfDisease = disease.incidence;
	}

	function getName() public view returns (uint diseaseName) {
		diseaseName = disease.name;
	}

	function getallNum() public view returns (uint allNum) {
		allNum = disease.allParticipantNum;
	}

	function getpatientsNum() public view returns (uint patientsNum) {
		patientsNum = disease.patientNum;
	}
}