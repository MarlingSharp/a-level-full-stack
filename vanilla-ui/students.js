// Define a HTML Custom Element for our student rows
class StudentRow extends HTMLDivElement {
    static get observedAttributes() { return ['studentName', 'studentHouse']; }

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        let nameSpan = document.createElement('span');
        nameSpan.innerText = this.getAttribute('studentName');

        let houseSpan = document.createElement('span');
        houseSpan.innerText = this.getAttribute('studentHouse');

        // Add these elements to our DOM
        this.appendChild(nameSpan);
        this.appendChild(houseSpan);
    }
}

customElements.define('student-row', StudentRow, { extends: 'div' });


// When the students are returned from the REST API, add them to the user interface
function studentsRetreived(students) {

    // Get a reference to the students container
    let studentsDiv = document.getElementById('student-container');

    // For each student returned to the UI
    students.forEach(student => {
        // Create the 'row' for this student
        let studentDiv = document.createElement('div', { is: 'student-row' });

        // Set the properties on the student
        studentDiv.setAttribute('studentName', student.name);
        studentDiv.setAttribute('studentHouse', student.house);

        // Add this students div to the overall student container
        studentsDiv.appendChild(studentDiv);
    })
}

// Fetch all the students
fetch(`${SERVICE_HOST}/students`)
    .then(response => response.json())
    .then(studentsRetreived);