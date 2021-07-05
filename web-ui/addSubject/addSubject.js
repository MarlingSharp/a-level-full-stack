// Add a subject click handler
function cmdAddSubject(e) {
    let name = document.forms['newSubject']['subjectName'].value;
    let teacher = document.forms['newSubject']['subjectTeacher'].value;

    addSubjectToREST({ name, teacher })
        .then(() => alert(`Subject ${name} added with teacher ${teacher}`));

    e.preventDefault();
}
