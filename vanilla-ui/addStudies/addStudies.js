// Add a student click handler
function cmdAddStudies(e) {
    let studentId = document.forms['newStudies']['studentId'].value;
    let subjectId = document.forms['newStudies']['subjectId'].value;
    let targetGrade = document.forms['newStudies']['targetGrade'].value;

    addStudyToREST({ studentId, subjectId, targetGrade })
        .then(() => alert(`Study Added`));

    e.preventDefault();
}

const cmbStudent = document.getElementById('cmbStudent');
const cmbSubject = document.getElementById('cmbSubject');

getStudentsFromREST().then(students => {
    students.forEach(({ id, name }) => {
        let option = document.createElement('option');
        option.value = id;
        option.innerText = name;
        cmbStudent.appendChild(option);
    });
})

getSubjectsFromREST().then(subjects => {
    subjects.forEach(({ id, name }) => {
        let option = document.createElement('option');
        option.value = id;
        option.innerText = name;
        cmbSubject.appendChild(option);
    });
})