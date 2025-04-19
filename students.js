console.log('students.js is executing...');

const id_form_create_new_student = document.getElementById("id_form_create_new_student");
id_form_create_new_student.addEventListener('submit', handleCreateNewStudentEvent);

const div_create_new_student = document.getElementById("create_new_student");
const div_show_student_details = document.getElementById("show_student_details");
// const div_update_student_details = document.getElementById("update_student_details");
// const div_delete_student = document.getElementById("delete_student");
const div_list_of_students = document.getElementById("list_of_students");


// TODO: add your code here
document.addEventListener("DOMContentLoaded", async function()
{
    await getAndDisplayAllStudents();
});

// =====================================================================================================================
// Functions that interact with the API
// =====================================================================================================================

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


/**
 * @param studentId the student's id that you want to retrieve
 * @returns the student with id = student as JSON or null if the student could not be retrieved from the API
 */
async function getStudent(studentId)
{
    console.log(`getStudent(${studentId}) - START`);
    console.log("studentId " + studentId);

    const API_URL = 'http://localhost:8080/students/' + studentId;

    console.log('Calling the API to get the student with id  ${studentId}...');

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            console.log("Retrieved the students successfully, now we just need to process them...");

            const listStudentsAsJSON = await response.json();
            console.log({listStudentsAsJSON});

            return listStudentsAsJSON;
        }
        else
        {
            console.log(`ERROR: failed to retrieve the student with id ${studentId}...`);
        }
    }
    catch(error)
    {
        console.log(error);
        console.log(`ERROR: failed to retrieve the student with id ${studentId}...`);
    }

    console.log(`getStudent(${studentId}) - END`);

    return null;
}

async function createNewStudent(studentData)
{
    const API_URL = 'http://localhost:8080/students';

    try
    {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(studentData)
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const createdStudent = await response.json();
            div_create_new_student.innerHTML = `<p class="success">Student created successfully. The new student id is ${createdStudent.id}</p>`;
            await getAndDisplayAllStudents();
        }
        else
        {
            div_create_new_student.innerHTML = '<p class="failure">ERROR: failed to create the new student.</p>';
        }
    }
    catch(error)
    {
        console.log(error);
        div_create_new_student.innerHTML = '<p class="failure">ERROR: failed to connect to the API to create the new student.</p>';
    }
}

// =====================================================================================================================
// Functions that update the HTML by manipulating the DOM
// =====================================================================================================================


async function handleCreateNewStudentEvent(event)
{
    event.preventDefault();

    const formData = new FormData(id_form_create_new_student);
    const studentData =
        {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            birthDate: formData.get('birthDate')
        };
    console.log({studentData});
    await createNewStudent(studentData);
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
            <p>
                <!-- TODO: this is for extra credit -->
                <a href="students.show.html?student_id=${studentAsJSON.id}">Show this student</a>
            </p>
            <button onclick="handleShowStudentDetailsEvent(event)">Show Student Details</button>
<!--            <button onclick="handleUpdateStudentDetailsEvent(event)">Update Student Details</button>-->
<!--            <button onclick="handleDeleteStudentEvent(event)">Delete Student</button>-->
        </div>`;
}

async function handleShowStudentDetailsEvent(event)
{
    console.log('handleShowStudentDetailsEvent -START');
    console.log(`event = ${event}`);
    console.log({event});
    const studentId = event.target.parentElement.getAttribute('data-id');
    let studentAsJSON = await getStudent(studentId);
    console.log(studentAsJSON);
    if (studentAsJSON == null)
    {
        div_show_student_details.innerHTML = `<p class="failure">ERROR: failed to retrieve the student with id ${studentId}</p>`;
    }
    else
    {
        displayStudentDetails(studentAsJSON);
    }

    console.log(studentAsJSON);
}

function displayStudentDetails(studentAsJSON)
{
    console.log({studentAsJSON});
    div_show_student_details.innerHTML = `<div class="show-student-details" data-id="${studentAsJSON.id}"> 
        <p>Student ID (this is just for debugging): ${studentAsJSON.id}</p> 
        <p>Student First Name: ${studentAsJSON.firstName}</p> 
        <p>Student Last Name: ${studentAsJSON.lastName}</p>
        <p>Student Birth Date: ${studentAsJSON.birthDate}</p> 
    </div>`;
}
