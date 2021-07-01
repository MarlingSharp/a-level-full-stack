function addStudentToREST(student) {
    fetch(`${SERVICE_HOST}/students`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(student) // body data type must match "Content-Type" header
    })
        .then(response => response.json())
        .then(() => window.location = 'students');
}

function getStudentsFromREST() {
    // Fetch all the students
    fetch(`${SERVICE_HOST}/students`)
        .then(response => response.json())
        .then(studentsRetreived);
}

// Add a student click handler
function cmdAddStudent(e) {
    let name = document.forms['newStudent']['studentName'].value;
    let house = document.forms['newStudent']['studentHouse'].value;
    let age = document.forms['newStudent']['studentAge'].value;

    addStudentToREST({ name, age, house });

    e.preventDefault();
}