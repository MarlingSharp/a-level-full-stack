// Add a student click handler
function cmdAddStudent(e) {
    let name = document.forms['newStudent']['studentName'].value;
    let house = document.forms['newStudent']['studentHouse'].value;
    let age = document.forms['newStudent']['studentAge'].value;

    addStudentToREST({ name, age, house })
        .then(() => alert(`Student ${name} added in house ${house}`));

    e.preventDefault();
}