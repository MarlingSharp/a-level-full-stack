// Define a HTML Custom Element for our student rows
class StudentRow extends HTMLDivElement {
    static get observedAttributes() { return ['studentName', 'studentHouse']; }

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        let studentId = this.getAttribute('studentId');

        let nameSpan = document.createElement('span');
        nameSpan.innerText = this.getAttribute('studentName');

        let ageSpan = document.createElement('span');
        ageSpan.innerText = this.getAttribute('studentAge');

        let houseSpan = document.createElement('span');
        houseSpan.innerText = this.getAttribute('studentHouse');

        let houseImageSpan = document.createElement('img');
        houseImageSpan.classList.add('house-logo-sm')
        houseImageSpan.src = `images/${this.getAttribute('studentHouse').toLowerCase()}.jpeg`

        let actionSpan = document.createElement('span');
        let cmdDelete = document.createElement('button');
        cmdDelete.innerText = 'Delete';
        cmdDelete.onclick = () => removeStudentFromREST(studentId);
        actionSpan.appendChild(cmdDelete);

        // Add these elements to our DOM
        this.appendChild(nameSpan);
        this.appendChild(ageSpan);
        this.appendChild(houseSpan);
        this.appendChild(houseImageSpan);
        this.appendChild(actionSpan);
    }
}

customElements.define('student-row', StudentRow, { extends: 'div' });

// Get a reference to the students container, we will need it in various places
let studentsDiv = document.getElementById('student-container');

const generateStudentId = (studentId) => `student-${studentId}`;

function addStudentToUi(student) {
    // Create the 'row' for this student
    let studentDiv = document.createElement('div', { is: 'student-row' });
    studentDiv.setAttribute('id', generateStudentId(student.id));

    // Set the properties on the student
    studentDiv.setAttribute('studentId', student.id);
    studentDiv.setAttribute('studentAge', student.age);
    studentDiv.setAttribute('studentName', student.name);
    studentDiv.setAttribute('studentHouse', student.house);

    // Add this students div to the overall student container
    studentsDiv.appendChild(studentDiv);
}

function removeStudentFromUi(studentId) {
    let studentDiv = document.getElementById(generateStudentId(studentId));
    studentDiv.remove();
}

// When the students are returned from the REST API, add them to the user interface
function studentsRetreived(students) {
    // For each student returned to the UI
    students.forEach(addStudentToUi)
}

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
        .then(addStudentToUi);
}

function removeStudentFromREST(studentId) {
    fetch(`${SERVICE_HOST}/students/${studentId}`, {
        method: 'DELETE'
    }).then(() => removeStudentFromUi(studentId));
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

// Initial population of UI
getStudentsFromREST();