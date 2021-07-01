const urlParams = new URLSearchParams(window.location.search);
const subjectId = urlParams.get('subjectId');

const subjectNameH2 = document.getElementById('subjectName');
const tableBody = document.getElementById('tableBody');

function studiesRetrieved(whoStudies) {
    subjectNameH2.innerText = whoStudies.subjectName;

    whoStudies.students.forEach(student => {
        const newRow = document.createElement('tr');
        newRow.setAttribute('id', generateStudyId(student.studentId, subjectId));

        const tdName = document.createElement('td');
        tdName.innerText = student.studentName;

        const tdGrade = document.createElement('td');
        tdGrade.innerText = student.targetGrade;

        const tdActions = document.createElement('td');
        const cmdDelete = document.createElement('button');
        cmdDelete.classList.add('button')
        cmdDelete.innerText = 'Delete';
        cmdDelete.onclick = () => removeStudyFromREST(student.studentId, subjectId)
            .then(() => removeStudyFromUi(student.studentId, subjectId));
        tdActions.appendChild(cmdDelete);

        newRow.appendChild(tdName);
        newRow.appendChild(tdGrade);
        newRow.appendChild(tdActions);

        tableBody.appendChild(newRow);
    })
}

getWhoStudiesFromREST(subjectId).then(studiesRetrieved);