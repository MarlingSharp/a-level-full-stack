function addSubjectToREST(subject) {
    return fetch(`${SERVICE_HOST}/subjects`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(subject) // body data type must match "Content-Type" header
    })
        .then(response => response.json())

}

function removeSubjectFromREST(subjectId) {
    return fetch(`${SERVICE_HOST}/subjects/${subjectId}`, {
        method: 'DELETE'
    });
}

function getSubjectsFromREST() {
    // Fetch all the subjects
    return fetch(`${SERVICE_HOST}/subjects`)
        .then(response => response.json());
}
