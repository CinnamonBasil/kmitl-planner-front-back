import axios from "axios";

function csvToJson(csvData) {
    const lines = csvData.split('\n');
    const result = [];

    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
        }
        result.push(obj);
    }

    return JSON.stringify(result);
}

async function readCsvFile() {
    const input = document.getElementById("csvFileInput");
    const file = input.files[0];
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function() {
        const csvData = reader.result;
        const json = csvToJson(csvData);
        console.log(json);
        const real_json = JSON.parse(json);
        console.log(real_json)
        // make a post axios request to the server
        axios.post("http://localhost:8080/api/insertSubject", {data: {
            payload: real_json
        }}).then((res)=>{
            alert("inserted successfully");
            console.log(res.data);
        }).catch((err)=>{
            console.log(err);
        });
    };
}

const csvButton = document.getElementById("readCsvFile");
csvButton.addEventListener("click", readCsvFile);

const subject_table = document.getElementById("subject_list");

setInterval(async ()=>{
    // make a get axios request to the server and build dom and add to subject_table
    const response = await axios.get("http://localhost:8080/api/subject");
    const subjects = response.data.match_subject;
    subject_table.innerHTML = "";
    subjects.forEach(subject => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerHTML = subject.subject_id;
        const td2 = document.createElement("td");
        td2.innerHTML = subject.subject_name;
        const td3 = document.createElement("td");
        td3.innerHTML = subject.credit;
        const td4 = document.createElement("td");
        td4.innerHTML = subject.type;
        const delete_button = document.createElement("button");
        delete_button.innerHTML = "Delete";
        delete_button.setAttribute("value", subject.subject_id);
        delete_button.addEventListener("click", (e)=>{
            deleteSubject(e.target.value);
        });
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(delete_button);
        subject_table.appendChild(tr);
    });

}, 1000);

async function deleteSubject(subject_id) {
    // make a delete axios request to the server
    if (!confirm('Are you sure you want to delete this subject?')){
        return;
    }
    let res = await axios.delete(`http://localhost:8080/api/subject`, {data: {
        subject_id: subject_id
    }});
    if(res.data.error == "false"){
        console.log("deleted successfully")
    }else{
        console.log("error in deleting")
    }
}

const addSubjectButton = document.getElementById("addSubject");
addSubjectButton.addEventListener("click", ()=>{
    const subject_id = document.getElementById("subject_id").value;
    const subject_name = document.getElementById("subject_name").value;
    const credit = document.getElementById("credit").value;
    const type = document.getElementById("type").value;
    // make a post axios request to the server
    axios.put("http://localhost:8080/api/subject", {data: {
        subject_id: subject_id,
        subject_name: subject_name,
        credit: credit,
        type: type
    }}).then((res)=>{
        alert("inserted successfully");
        console.log(res.data);
    }).catch((err)=>{
        console.log(err);
    });
});