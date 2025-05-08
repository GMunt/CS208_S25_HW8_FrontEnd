console.log('registered_students.js is executing...');

const div_select_class_for_enrollment= document.getElementById('selectClassForEnrollment');
const div_list_of_registered_students= document.getElementById('list_of_registered_students');
const div_enroll_student_in_to_class_and_update_display = document.getElementById('enrollStudentInToClassAndUpdateDisplay');
const div_drop_student_from_class_and_update_display = document.getElementById('dropStudentFromClassAndUpdateDisplay');

document.addEventListener('DOMContentLoaded', async function()
{
   await getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown();
   await getAllAndRefreshAllRegisteredStudentsForDropping();
   await getAllClassesForDroppingDropdown();
   await getAllAndDisplayRegisteredStudentsAndRefreshTheSelectStudentForEnrollmentDropdown();
});

async function getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown()
{
    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - START');

    const API_URL = "http://localhost:8080/classes";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const listOfClassesAsJSON = await response.json();
            console.log({listOfClassesAsJSON});

            refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON);
        }
        else
        {
            // TODO: update the HTML with information that we failed to retrieve the classes
            div_select_class_for_enrollment.innerHTML = '<p class="failure">ERROR: failed to retrieve the classes.</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        // TODO: update the HTML with information that we failed to connect to the API to fetch the classes data
        div_select_class_for_enrollment.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the classes data.</p>';
    }

    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - END');
}

async function getAllAndDisplayRegisteredStudentsAndRefreshTheSelectStudentForEnrollmentDropdown()
{
    console.log('getAllAndDisplayRegisteredStudentsAndRefreshTheSelectStudentForEnrollmentDropdown - START');
    const API_URL = "http://localhost:8080/registered_students";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const listOfRegisteredStudentsAsJSON = await response.json();
            console.log({listOfRegisteredStudentsAsJSON});

            displayRegisteredStudents(listOfRegisteredStudentsAsJSON);
            await getAllStudentsAndRefreshTheListOfStudents();
        }
        else
        {
            div_list_of_registered_students.innerHTML = '<p class="failure">ERROR: failed to retrieve the registered students.</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_list_of_registered_students.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the registered students data.</p>';
    }
    console.log('getAllAndDisplayRegisteredStudentsAndRefreshTheSelectStudentForEnrollmentDropdown - STOP');
}

async function getAllStudentsAndRefreshTheListOfStudents()
{
    console.log('getAllStudents - START');

    const API_URL = "http://localhost:8080/students";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);3
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const listOfStudentsAsJSON = await response.json();
            console.log({listOfStudentsAsJSON});
            refreshTheListOfStudents(listOfStudentsAsJSON);
        }
        else
        {
            div_enroll_student_in_to_class_and_update_display.innerHTML = '<p class="failure">ERROR: failed to retrieve the students.</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_enroll_student_in_to_class_and_update_display.innerHTML = '<p class="failure">ERROR: failed to connect to API to retrieve the students.</p>';
    }
    console.log('getAllStudentsAndRefreshTheListOfStudents - STOP');
}

document.getElementById('id_form_add_new_student_to_a_class').addEventListener('submit', async function (event)
{
    event.preventDefault();
    await addStudentToClassAndRefreshListOfRegisteredStudents();
});

async function addStudentToClassAndRefreshListOfRegisteredStudents()
{
    const API_URL = 'http://localhost:8080/add_student_to_class';

    try
    {
        const select_student_ID = document.getElementById('selectStudentForEnrollment');
        const select_class_ID = document.getElementById('selectClassForEnrollment');

        const bodyData = `studentId=${encodeURIComponent(select_student_ID.value)}&classId=${encodeURIComponent(select_class_ID.value)}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: bodyData
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_enroll_student_in_to_class_and_update_display.innerHTML = `<p class="success">Student ${select_student_ID.value} was successfully registered in class ${select_class_ID.value}.</p>`;
            await getAllAndDisplayRegisteredStudentsAndRefreshTheSelectStudentForEnrollmentDropdown();
            await getAllClassesForDroppingDropdown();
        }
        else
        {
            div_enroll_student_in_to_class_and_update_display.innerHTML = `<p class="failure">ERROR: failed to add student ${select_student_ID.value} to class ${select_class_ID.value}.</p>`;
        }
    }
    catch (error)
    {
        console.error(error);
        div_enroll_student_in_to_class_and_update_display.innerHTML = `<p class="failure">ERROR: failed to connect to the API to fetch the registered students.</p>`;
    }
}

async function getAllAndDisplayRegisteredStudentsAndRefreshTheSelectStudentForDroppingDropdown()
{
    console.log('getAllAndDisplayRegisteredStudentsAndRefreshTheSelectStudentForDroppingDropdown - START');
    const API_URL = "http://localhost:8080/registered_students";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const listOfRegisteredStudentsAsJSON = await response.json();
            console.log({listOfRegisteredStudentsAsJSON});

            await refreshTheSelectClassForDroppingDropdown(listOfRegisteredStudentsAsJSON);
            await getAllStudentsAndRefreshTheListOfStudents();
            await displayRegisteredStudents(listOfRegisteredStudentsAsJSON);
        }
        else
        {
            div_list_of_registered_students.innerHTML = '<p class="failure">ERROR: failed to retrieve the registered students.</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_list_of_registered_students.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the registered students data.</p>';
    }
    console.log('getAllAndDisplayRegisteredStudentsAndRefreshTheSelectStudentForDroppingDropdown - STOP');
}

document.getElementById('id_form_drop_student_from_a_class').addEventListener('submit', async function (event)
{
    event.preventDefault();
    await dropStudentFromClassAndRefreshListOfRegisteredStudents();
});

async function dropStudentFromClassAndRefreshListOfRegisteredStudents()
{
    try
    {
        const select_student_ID = document.getElementById('selectStudentToDrop');
        const select_class_ID = document.getElementById('selectClassToDrop');

        const studentId = select_student_ID.value;
        const classId = select_class_ID.value;

        const url = `http://localhost:8080/drop_student_from_class?studentId=${encodeURIComponent(studentId)}&classId=${encodeURIComponent(classId)}`;

        const response = await fetch(url, {
            method: 'DELETE'
        });

        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_drop_student_from_class_and_update_display.innerHTML = `<p class="success">Successfully dropped student ${select_student_ID.value} from class ${select_class_ID.value}.</p>`;
            await getAllAndDisplayRegisteredStudentsAndRefreshTheSelectStudentForDroppingDropdown();
        }
        else
        {
            div_drop_student_from_class_and_update_display.innerHTML = `<p class="failure">ERROR: failed to drop student ${select_student_ID.value} from class ${select_class_ID.value}.</p>`;
        }
    }
    catch (error)
    {
        console.error(error);
        div_drop_student_from_class_and_update_display.innerHTML = `<p class="failure">ERROR: failed to connect to the API to fetch the registered students.</p>`;
    }
}

function displayRegisteredStudents(listOfRegisteredStudentsAsJSON) {
    div_list_of_registered_students.innerHTML = '';

    for (const studentAsJSON of listOfRegisteredStudentsAsJSON)
    {
        console.log({studentAsJSON});
        div_list_of_registered_students.innerHTML += renderStudentAsHTML(studentAsJSON);
    }
}

function renderStudentAsHTML(studentAsJSON) {
    return `
        <div class="show-student-in-list" data-id="${studentAsJSON.id}">
            <p>Name: ${studentAsJSON.studentFullName}</p>
            <p>Registered in: ${studentAsJSON.code}</p>
        </div>`;
}

async function getAllAndRefreshAllRegisteredStudentsForDropping()
{
    const API_URL = 'http://localhost:8080/registered_students';

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const listOfRegisteredStudentsAsJSON = await response.json();
            console.log(listOfRegisteredStudentsAsJSON);

            refreshTheListOfRegisteredStudentsForDropping(listOfRegisteredStudentsAsJSON);
        }
        else
        {
            div_drop_student_from_class_and_update_display.innerHTML = '<p class="failure">ERROR: failed to fetch the registered students.</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_drop_student_from_class_and_update_display.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the registered students.</p>';
    }
}

function refreshTheListOfRegisteredStudentsForDropping(listOfRegisteredStudentsAsJSON)
{
    const selectStudentToDrop = document.getElementById("selectStudentToDrop");

    while (selectStudentToDrop.firstChild)
    {
        selectStudentToDrop.removeChild(selectStudentToDrop.firstChild);
    }

    const option = document.createElement("option");
    option.value = "";
    option.text = "Select a student for a class";
    option.disabled = true;
    option.selected = true;
    selectStudentToDrop.appendChild(option);

    // Track seen student IDs
    const seenStudentIds = new Set();

    for (const studentAsJSON of listOfRegisteredStudentsAsJSON) {
        if (seenStudentIds.has(studentAsJSON.studentId)) {
            continue; // Skip duplicates
        }

        seenStudentIds.add(studentAsJSON.studentId); // Mark as seen

        const option = document.createElement("option");
        option.value = studentAsJSON.studentId;
        option.text = studentAsJSON.studentFullName;

        selectStudentToDrop.appendChild(option);
    }
}

async function getAllClassesForDroppingDropdown() {
    const API_URL = "http://localhost:8080/classes";

    try {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const listOfClassesAsJSON = await response.json();
            console.log({listOfClassesAsJSON});

            refreshTheSelectClassForDroppingDropdown(listOfClassesAsJSON);
        } else {
            div_select_class_for_enrollment.innerHTML = '<p class="failure">ERROR: failed to retrieve the classes.</p>';
        }
    } catch (error) {
        console.error(error);
        div_select_class_for_enrollment.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the classes data.</p>';
    }
}

function refreshTheSelectClassForDroppingDropdown(listOfClassesAsJSON)
{
    const selectClassToDrop = document.getElementById("selectClassToDrop");

    // delete all existing options (i.e., children) of the selectClassForEnrollment
    while (selectClassToDrop.firstChild)
    {
        selectClassToDrop.removeChild(selectClassToDrop.firstChild);
    }

    const option = document.createElement("option");
    option.value = "";
    option.text = "Select a class";
    option.disabled = true;
    option.selected = true;
    selectClassToDrop.appendChild(option);

    for (const classAsJSON of listOfClassesAsJSON)
    {
        const option = document.createElement("option");
        option.value = classAsJSON.id;                              // this is the value that will be sent to the server
        option.text = classAsJSON.code + ": " + classAsJSON.title;  // this is the value the user chooses from the dropdown

        selectClassToDrop.appendChild(option);
    }
}

function refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON)
{
    const selectClassForEnrollment = document.getElementById("selectClassForEnrollment");

    // delete all existing options (i.e., children) of the selectClassForEnrollment
    while (selectClassForEnrollment.firstChild)
    {
        selectClassForEnrollment.removeChild(selectClassForEnrollment.firstChild);
    }

    const option = document.createElement("option");
    option.value = "";
    option.text = "Select a class";
    option.disabled = true;
    option.selected = true;
    selectClassForEnrollment.appendChild(option);

    for (const classAsJSON of listOfClassesAsJSON)
    {
        const option = document.createElement("option");
        option.value = classAsJSON.id;                              // this is the value that will be sent to the server
        option.text = classAsJSON.code + ": " + classAsJSON.title;  // this is the value the user chooses from the dropdown

        selectClassForEnrollment.appendChild(option);
    }
}
function refreshTheListOfStudents(listOfRegisteredStudentsAsJSON)
{
    const selectStudentForEnrollment = document.getElementById("selectStudentForEnrollment");

    while (selectStudentForEnrollment.firstChild)
    {
        selectStudentForEnrollment.removeChild(selectStudentForEnrollment.firstChild);
    }

    const option = document.createElement("option");
    option.value = "";
    option.text = "Select a student for a class";
    option.disabled = true;
    option.selected = true;
    selectStudentForEnrollment.appendChild(option);

    // Track seen student IDs
    const seenStudentIds = new Set();

    for (const studentAsJSON of listOfRegisteredStudentsAsJSON) {
        if (seenStudentIds.has(studentAsJSON.id)) {
            continue; // Skip if we've already seen this student
        }

        seenStudentIds.add(studentAsJSON.id); // Mark this student as seen

        const option = document.createElement("option");
        option.value = studentAsJSON.id;
        option.text = studentAsJSON.firstName + " " + studentAsJSON.lastName;

        selectStudentForEnrollment.appendChild(option);
    }
}
