class NavigationBar extends HTMLUListElement {

    static get observedAttributes() { return ['activePage']; }

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        const activePage = this.getAttribute('activePage');

        [
            { page: 'index', title: 'Home' },
            { page: 'students', title: 'Students' },
            { page: 'subjects', title: 'Subjects' },
            { page: 'addStudent', title: 'Add Student' },
            { page: 'addSubject', title: 'Add Subject' },
            { page: 'addStudies', title: 'Add Studies' }
        ].forEach(({ page, title }) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = page;
            a.innerText = title;
            if (activePage === page) {
                a.classList.add('active')
            }
            li.appendChild(a);
            this.appendChild(li);
        })
    }
}

customElements.define('nav-bar', NavigationBar, { extends: 'ul' });