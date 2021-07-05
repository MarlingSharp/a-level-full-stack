const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('studentId');

console.log('Student ID ' + studentId)

const studentNameH2 = document.getElementById('studentName');
const tableBody = document.getElementById('tableBody');

function studiesRetrieved(whatTheyStudy) {
    studentNameH2.innerText = whatTheyStudy.studentName;

    whatTheyStudy.subjects.forEach(subject => {
        console.log(subject);
        const newRow = document.createElement('tr');
        newRow.setAttribute('id', generateStudyId(studentId, subject.subjectId));

        const tdName = document.createElement('td');
        tdName.innerText = subject.subjectName;

        const tdGrade = document.createElement('td');
        tdGrade.innerText = subject.targetGrade;

        const tdActions = document.createElement('td');
        const cmdDelete = document.createElement('button');
        cmdDelete.classList.add('button')
        cmdDelete.innerText = 'Delete';
        cmdDelete.onclick = () => removeStudyFromREST(studentId, subject.subjectId)
            .then(() => removeStudyFromUi(studentId, subject.subjectId));
        tdActions.appendChild(cmdDelete);

        newRow.appendChild(tdName);
        newRow.appendChild(tdGrade);
        newRow.appendChild(tdActions);

        tableBody.appendChild(newRow);
    })
}

function removeStudyFromUi(studentId, subjectId) {
    let studyDiv = document.getElementById(generateStudyId(studentId, subjectId));
    studyDiv.remove();
}

getWhatTheyStudyFromREST(studentId).then(studiesRetrieved);