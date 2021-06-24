// Define a HTML Custom Element for our student rows
class SubjectRow extends HTMLDivElement {
    static get observedAttributes() { return ['subjectName', 'subjectTeacher']; }

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        let nameSpan = document.createElement('span');
        nameSpan.innerText = this.getAttribute('subjectName');

        let teacherSpan = document.createElement('span');
        teacherSpan.innerText = this.getAttribute('subjectTeacher');

        // Add these elements to our DOM
        this.appendChild(nameSpan);
        this.appendChild(teacherSpan);
    }
}

customElements.define('subject-row', SubjectRow, { extends: 'div' });


// When the students are returned from the REST API, add them to the user interface
function subjectsRetreived(students) {

    // Get a reference to the students container
    let subjectsDiv = document.getElementById('student-container');

    // For each student returned to the UI
    students.forEach(student => {
        // Create the 'row' for this student
        let subjectDiv = document.createElement('div', { is: 'subject-row' });

        // Set the properties on the student
        subjectDiv.setAttribute('subjectName', student.name);
        subjectDiv.setAttribute('subjectTeacher', student.teacher);

        // Add this students div to the overall student container
        subjectsDiv.appendChild(subjectDiv);
    })
}

// Fetch all the students
fetch(`${SERVICE_HOST}/subjects`)
    .then(response => response.json())
    .then(subjectsRetreived);