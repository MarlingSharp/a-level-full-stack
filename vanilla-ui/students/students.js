// Define a HTML Custom Element for our student rows
class StudentRow extends HTMLTableRowElement {
    static get observedAttributes() { return ['studentName', 'studentHouse']; }

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        let studentId = this.getAttribute('studentId');

        let nameSpan = document.createElement('td');
        nameSpan.innerText = this.getAttribute('studentName');

        let ageSpan = document.createElement('td');
        ageSpan.innerText = this.getAttribute('studentAge');

        let houseSpan = document.createElement('td');
        houseSpan.innerText = this.getAttribute('studentHouse');

        let actionSpan = document.createElement('td');

        // Delete button
        let cmdDelete = document.createElement('button');
        cmdDelete.classList.add('button');
        cmdDelete.innerText = 'Delete';
        cmdDelete.onclick = () => removeStudentFromREST(studentId).then(() => removeStudentFromUi(studentId));

        // What they study link
        let aWhatTheyStudy = document.createElement('a');
        aWhatTheyStudy.href = `whatTheyStudy?studentId=${studentId}`
        aWhatTheyStudy.innerText = 'Studies';
        aWhatTheyStudy.classList.add('button')

        actionSpan.appendChild(cmdDelete);
        actionSpan.appendChild(aWhatTheyStudy);

        // Add these elements to our DOM
        this.appendChild(nameSpan);
        this.appendChild(ageSpan);
        this.appendChild(houseSpan);
        this.appendChild(actionSpan);
    }
}

customElements.define('student-row', StudentRow, { extends: 'tr' });

// Get a reference to the students container, we will need it in various places
let studentTableBody = document.getElementById('studentTableBody');

const generateStudentId = (studentId) => `student-${studentId}`;

function addStudentToUi(student) {
    // Create the 'row' for this student
    let studentDiv = document.createElement('tr', { is: 'student-row' });
    studentDiv.setAttribute('id', generateStudentId(student.id));

    // Set the properties on the student
    studentDiv.setAttribute('studentId', student.id);
    studentDiv.setAttribute('studentAge', student.age);
    studentDiv.setAttribute('studentName', student.name);
    studentDiv.setAttribute('studentHouse', student.house);

    // Add this students div to the overall student container
    studentTableBody.appendChild(studentDiv);
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

// Initial population of UI
getStudentsFromREST().then(studentsRetreived);