const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('studentId');

console.log('Student ID ' + studentId)

const studentNameH2 = document.getElementById('studentName');
const tableBody = document.getElementById('tableBody');

function studiesRetrieved(whatTheyStudy) {
    studentNameH2.innerText = whatTheyStudy.studentName;

    whatTheyStudy.subjects.forEach(subject => {
        const newRow = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.innerText = subject.subjectName;

        const tdGrade = document.createElement('td');
        tdGrade.innerText = subject.targetGrade;

        const tdActions = document.createElement('td');
        const cmdDelete = document.createElement('button');
        cmdDelete.classList.add('button')
        cmdDelete.innerText = 'Delete';
        // cmdDelete.onclick = () => removeStudentFromREST(studentId);
        tdActions.appendChild(cmdDelete);

        newRow.appendChild(tdName);
        newRow.appendChild(tdGrade);
        newRow.appendChild(tdActions);

        tableBody.appendChild(newRow);
    })
}

function getWhatTheyStudyFromREST() {
    // Fetch all the students
    fetch(`${SERVICE_HOST}/students/whatTheyStudy/${studentId}`)
        .then(response => response.json())
        .then(studiesRetrieved);
}

getWhatTheyStudyFromREST()