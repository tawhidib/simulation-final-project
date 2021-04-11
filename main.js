"use strict";
let count = 0;
let totalIAT = 0;
let totalService = 0;
let totalWaiting = 0;
let totalIdle = 0;
let totalSpend = 0;
let mainMatix = new Array(1000);
let tableHead = [
	"SI No",
	"RD For Arrival",
	"Inter Arrival Time",
	"Arrival Time",
	"Rd For Service",
	"Service Time",
	"Service Begin",
	"Service End",
	"Wait In Queue",
	"Service Idel Time",
	"Time Spend In System",
];
document.getElementById("myDIV").style.display = "none";
let tableTemp = document.getElementById("resultTable");

function createRow(table, arr) {
	if (count != 0) {
		tableTemp.deleteRow(count + 1);
	}
	let newRow = table.insertRow(-1);
	for (var i = 0; i < arr.length; i++) {
		let newCell = newRow.insertCell();
		let newText = document.createTextNode(arr[i]);
		newCell.appendChild(newText);
	}
	totalIAT += arr[2];
	totalService += arr[5];
	totalWaiting += arr[8];
	totalIdle += arr[9];
	totalSpend += arr[10];
	arr = [
		"Total: ",
		"",
		totalIAT,
		"",
		"",
		totalService,
		"",
		"",
		totalWaiting,
		totalIdle,
		totalSpend,
	];
	let totalRow = table.insertRow(-1);
	for (var i = 0; i < arr.length; i++) {
		let newCell = totalRow.insertCell();
		let newText = document.createTextNode(arr[i]);
		newCell.appendChild(newText);
	}
}
function calculation() {
	let rdForIAT,
		rdforST,
		interArrivalTime,
		arrivalTime,
		serviceTime,
		serviceBegin,
		serviceEnd,
		waitInQueue,
		serviceIdelTime,
		timeSpendInSystem;

	rdForIAT = mainMatix[count][1];
	rdforST = mainMatix[count][4];
	//interArrival
	if (rdForIAT === 0) {
		interArrivalTime = 0;
	} else if (rdForIAT >= 1 && rdForIAT <= 125) {
		interArrivalTime = 1;
	} else if (rdForIAT >= 126 && rdForIAT <= 250) {
		interArrivalTime = 2;
	} else if (rdForIAT >= 251 && rdForIAT <= 375) {
		interArrivalTime = 3;
	} else if (rdForIAT >= 376 && rdForIAT <= 500) {
		interArrivalTime = 4;
	} else if (rdForIAT >= 501 && rdForIAT <= 625) {
		interArrivalTime = 5;
	} else if (rdForIAT >= 626 && rdForIAT <= 750) {
		interArrivalTime = 6;
	} else if (rdForIAT >= 751 && rdForIAT <= 875) {
		interArrivalTime = 7;
	} else if (rdForIAT >= 876 && rdForIAT <= 1000) {
		interArrivalTime = 8;
	} else {
		alert(
			"RD for Inter Arrival Time allows 0-1000 integer value. Please Refresh the page, otherwise you will get error"
		);
	}
	mainMatix[count][2] = interArrivalTime;

	//arrival time
	if (count == 0) {
		arrivalTime = 0;
	} else {
		arrivalTime = mainMatix[count - 1][3] + interArrivalTime;
	}
	mainMatix[count][3] = arrivalTime;

	// service time
	if (rdforST >= 1 && rdforST <= 10) {
		serviceTime = 1;
	} else if (rdforST >= 11 && rdforST <= 30) {
		serviceTime = 2;
	} else if (rdforST >= 31 && rdforST <= 60) {
		serviceTime = 3;
	} else if (rdforST >= 61 && rdforST <= 85) {
		serviceTime = 4;
	} else if (rdforST >= 86 && rdforST <= 95) {
		serviceTime = 5;
	} else if (rdforST >= 96 && rdforST <= 100) {
		serviceTime = 6;
	} else {
		alert(
			"RD for Service Time allows 0-100 integer value. Please Refresh the page, otherwise you will get error"
		);
	}
	mainMatix[count][5] = serviceTime;

	//service begin
	if (count == 0) {
		serviceBegin = 0;
		serviceEnd = serviceBegin + serviceTime;
		mainMatix[count][6] = serviceBegin;
		mainMatix[count][7] = serviceEnd;
	} else {
		serviceBegin = Math.max(mainMatix[count - 1][7], arrivalTime);
		mainMatix[count][6] = serviceBegin;
	}

	//service end
	serviceEnd = serviceBegin + serviceTime;
	mainMatix[count][7] = serviceEnd;

	//  waiting queue
	// eikhane error hoite pare[marag]
	waitInQueue = serviceBegin - arrivalTime;
	mainMatix[count][8] = waitInQueue;

	//service Ideal time
	if (count == 0) {
		serviceIdelTime = serviceBegin;
	} else {
		serviceIdelTime = mainMatix[count][6] - mainMatix[count - 1][7];
	}
	mainMatix[count][9] = serviceIdelTime;

	//time spend in system
	timeSpendInSystem = waitInQueue + serviceTime;
	mainMatix[count][10] = timeSpendInSystem;

	//console.log(mainMatix[count]);

	document.getElementById("myDIV").style.display = "block";

	let table = document.getElementById("resultTable");
	createRow(table, mainMatix[count]);
}
document.getElementById("refresh").addEventListener("click", function () {
	location.reload();
});
document.getElementById("save").addEventListener("click", function () {
	var wb = XLSX.utils.book_new();
	wb.Props = {
		Title: "Single Channel Queue",
		Subject: "solution",
		Author: "Md Raiyan Hossain",
		CreatedDate: new Date(2021, 3, 30),
	};

	wb.SheetNames.push("Test Sheet");
	var ws_data = [[]];
	ws_data.push(tableHead);
	console.log(count);
	for (let i = 0; i < count; i++) {
		ws_data.push(mainMatix[i]);
	}
	ws_data.push([]);
	ws_data.push([
		"Total: ",
		"",
		totalIAT,
		"",
		"",
		totalService,
		"",
		"",
		totalWaiting,
		totalIdle,
		totalSpend,
	]);
	var ws = XLSX.utils.aoa_to_sheet(ws_data);
	wb.Sheets["Test Sheet"] = ws;

	var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
		return buf;
	}
	saveAs(
		new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
		"solution.xlsx"
	);
});

var input = document.getElementById("input");

input.addEventListener("change", function () {
	readXlsxFile(input.files[0]).then(function (data) {
		mainMatix = new Array(1000);
		count = 0;
		totalIAT = 0;
		totalService = 0;
		totalWaiting = 0;
		totalIdle = 0;
		totalSpend = 0;

		for (let i = 1; i < data.length - 1; i++) {
			let rdForIAT = data[i][1];
			let rdforST = data[i][4];
			mainMatix[count] = new Array(11);
			mainMatix[count][0] = count + 1;
			mainMatix[count][1] = rdForIAT;
			mainMatix[count][4] = rdforST;
			calculation(rdForIAT, rdforST);
			count++;
		}
	});
});
document.querySelector(".submit").addEventListener("click", function () {
	let rdForIAT = Number(document.querySelector("#iatInput").value);
	let rdforST = Number(document.querySelector("#stInput").value);
	document.querySelector("#iatInput").value = "";
	document.querySelector("#stInput").value = "";

	mainMatix[count] = new Array(11);
	mainMatix[count][0] = count + 1;
	mainMatix[count][1] = rdForIAT;
	mainMatix[count][4] = rdforST;
	calculation();
	count++;
});
