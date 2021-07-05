function getWhatTheyStudyFromREST(studentId) {
    // Fetch all the students
    return fetch(`${SERVICE_HOST}/studies/whatTheyStudy/${studentId}`)
        .then(response => response.json());
}

function getWhoStudiesFromREST(subjectId) {
    // Fetch all the students
    return fetch(`${SERVICE_HOST}/studies/whoStudies/${subjectId}`)
        .then(response => response.json());
}

function addStudyToREST(study) {
    return fetch(`${SERVICE_HOST}/studies/manage`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(study) // body data type must match "Content-Type" header
    })
        .then(response => response.json());
}


function removeStudyFromREST(studentId, subjectId) {
    return fetch(`${SERVICE_HOST}/studies/manage/${studentId}/${subjectId}`, {
        method: 'DELETE'
    });
}

function generateStudyId(studentId, subjectId) {
    return `study-${studentId}-${subjectId}`
}