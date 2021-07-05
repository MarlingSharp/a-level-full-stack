function getStudentsFromREST() {
    // Fetch all the students
    return fetch(`${SERVICE_HOST}/students`)
        .then(response => response.json());
}

function addStudentToREST(student) {
    return fetch(`${SERVICE_HOST}/students`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(student) // body data type must match "Content-Type" header
    })
        .then(response => response.json());
}

function removeStudentFromREST(studentId) {
    return fetch(`${SERVICE_HOST}/students/${studentId}`, {
        method: 'DELETE'
    });
}
