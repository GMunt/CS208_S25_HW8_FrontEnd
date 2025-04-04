console.log('students.js is executing...');

const div_list_of_students = document.getElementById('list_of_students');

// TODO: add your code here
document.addEventListener("DOMContentLoaded", async function()
{
    await getAndDisplayAllStudents();
});
// GET method
async function getAndDisplayAllStudents()
{
    console.log('getAndDisplayAllStudents - START');

    const API_URL = 'http://localhost:8080/students';

    div_list_of_students.innerHTML = "Calling the API to get the list of students...";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_list_of_students.innerHTML = "Retrieved the students successfully, now we just need to process them...";

            const listStudentsAsJSON = await response.json();
            console.log({listOfStudents: listStudentsAsJSON});

            displayStudents(listStudentsAsJSON);
        }
        else
        {
            div_list_of_students.innerHTML = '<p class="failure">ERROR: failed to retrieve the students.</p>';
        }
    }
    catch(error)
    {
        console.log(error);
        div_list_of_students.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the student\'s data.</p>';
    }

    console.log('getAndDisplayAllStudents - END');
}

function displayStudents(listOfStudentsAsJSON) {
    div_list_of_students.innerHTML = '';

    for (const studentAsJSON of listOfStudentsAsJSON)
    {
        console.log({studentAsJSON});
        div_list_of_students.innerHTML += renderStudentAsHTML(studentAsJSON);
    }
}

function renderStudentAsHTML(studentAsJSON) {
    return `
        <div class="show-student-in-list" data-id="${studentAsJSON.id}">
            <p>Student ID (for debuggin): ${studentAsJSON.id}</p>
            <p>Student First Name: ${studentAsJSON.firstName}</p>
            <p>Student Last Name: ${studentAsJSON.lastName}</p>
            <p>Student Birth Date: ${studentAsJSON.birthDate}</p>
        </div>`;
}
