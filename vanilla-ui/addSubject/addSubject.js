function addSubjectToREST(subject) {
    fetch(`${SERVICE_HOST}/subjects`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(subject) // body data type must match "Content-Type" header
    })
        .then(response => response.json())
        .then(() => window.location = 'subjects');
}

// Add a subject click handler
function cmdAddSubject(e) {
    let name = document.forms['newSubject']['subjectName'].value;
    let teacher = document.forms['newSubject']['subjectTeacher'].value;

    addSubjectToREST({ name, teacher });

    e.preventDefault();
}
