const urlParams = new URLSearchParams(window.location.search);
const subjectId = urlParams.get('subjectId');

const subjectNameH2 = document.getElementById('subjectName');
const tableBody = document.getElementById('tableBody');

function studiesRetrieved(whoStudies) {
    subjectNameH2.innerText = whoStudies.subjectName;

    whoStudies.students.forEach(subject => {
        const newRow = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.innerText = subject.studentName;

        const tdGrade = document.createElement('td');
        tdGrade.innerText = subject.targetGrade;

        const tdActions = document.createElement('td');
        const cmdDelete = document.createElement('button');
        cmdDelete.classList.add('button')
        cmdDelete.innerText = 'Delete';
        // cmdDelete.onclick = () => removeStudentFromREST(subjectId);
        tdActions.appendChild(cmdDelete);

        newRow.appendChild(tdName);
        newRow.appendChild(tdGrade);
        newRow.appendChild(tdActions);

        tableBody.appendChild(newRow);
    })
}

function getWhatTheyStudyFromREST() {
    // Fetch all the students
    fetch(`${SERVICE_HOST}/subjects/whoStudies/${subjectId}`)
        .then(response => response.json())
        .then(studiesRetrieved);
}

getWhatTheyStudyFromREST()