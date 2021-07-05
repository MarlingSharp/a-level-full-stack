// Define a HTML Custom Element for our subject rows
class SubjectRow extends HTMLTableRowElement {
    static get observedAttributes() { return ['subjectName', 'subjectHouse']; }

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        let subjectId = this.getAttribute('subjectId');

        let nameSpan = document.createElement('td');
        nameSpan.innerText = this.getAttribute('subjectName');

        let teacherSpan = document.createElement('td');
        teacherSpan.innerText = this.getAttribute('subjectTeacher');

        let actionSpan = document.createElement('td');
        let cmdDelete = document.createElement('button');
        cmdDelete.innerText = 'Delete';
        cmdDelete.classList.add('button')
        cmdDelete.onclick = () => removeSubjectFromREST(subjectId)
            .then(() => removeSubjectFromUi(subjectId));

        // Who studies lijnk
        let aWhoStudies = document.createElement('a');
        aWhoStudies.href = `whoStudies?subjectId=${subjectId}`
        aWhoStudies.innerText = 'Studies';
        aWhoStudies.classList.add('button')

        actionSpan.appendChild(cmdDelete);
        actionSpan.appendChild(aWhoStudies);

        // Add these elements to our DOM
        this.appendChild(nameSpan);
        this.appendChild(teacherSpan);
        this.appendChild(actionSpan);
    }
}

customElements.define('subject-row', SubjectRow, { extends: 'tr' });

// Get a reference to the subjects container, we will need it in various places
let subjectTableBody = document.getElementById('subjectTableBody');

const generateSubjectId = (subjectId) => `subject-${subjectId}`;

function addSubjectToUi(subject) {
    // Create the 'row' for this subject
    let subjectDiv = document.createElement('tr', { is: 'subject-row' });
    subjectDiv.setAttribute('id', generateSubjectId(subject.id));

    // Set the properties on the subject
    subjectDiv.setAttribute('subjectId', subject.id);
    subjectDiv.setAttribute('subjectName', subject.name);
    subjectDiv.setAttribute('subjectTeacher', subject.teacher);

    // Add this subjects div to the overall subject container
    subjectTableBody.appendChild(subjectDiv);
}

function removeSubjectFromUi(subjectId) {
    let subjectDiv = document.getElementById(generateSubjectId(subjectId));
    subjectDiv.remove();
}

// When the subjects are returned from the REST API, add them to the user interface
function subjectsRetreived(subjects) {
    // For each subject returned to the UI
    subjects.forEach(addSubjectToUi)
}

// Initial population of UI
getSubjectsFromREST().then(subjectsRetreived);;