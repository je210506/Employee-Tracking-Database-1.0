import inquirer from 'inquirer';
import {pool, connectToDb} from './db/connection';

//add a department
async function addDepartment() {
    const {departmentName} = await inquirer.prompt([
       {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the new department name:',
        validate: (input) => input.trim() !== '' || 'Department name cannot be empty.'
       } 
    ]);
    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
        console.log(`Department "${departmentName}" was added successfully! YAY!`);
    } catch (error) {
        console.log('Error adding department. Yikes!', error);
    }
}

//add employee
async function addEmployee() {
    const {firstName, lastName} = await inquirer.prompt([
       {
        type: 'input',
        name: 'firstName',
        message: 'Enter the new employee\'s name:',
        validate: (input) => input.trim() !== '' || 'First name cannot be empty.'
       },
       {
        type: 'input',
        name: 'lastName',
        message: 'lastName',
        validate: (input) => input.trim() !== '' || 'Last name cannot be empty.'
       }
    ]);
    try {
        await pool.query('INSERT INTO employee (first_name, last_name) VALUES ($1, $2)', [firstName, lastName]);
        console.log(`The new employee, "${firstName} ${lastName}" was added successfully! YAY!`);
    } catch (error) {
        console.log('Error adding the employees. Yikes!', error);
    }
}

//add role
async function addRole() {
    const {roleName} = await inquirer.prompt([
       {
        type: 'input',
        name: 'roleName',
        message: 'Enter a role name:',
        validate: (input) => input.trim() !== '' || 'Role name cannot be empty.'
       } 
    ]);
    try {
        await pool.query('INSERT INTO role (name) VALUES ($1)', [roleName]);
        console.log(`Department "${roleName}" was added successfully! YAY!`);
    } catch (error) {
        console.log('Error adding role. Try again.', error);
    }
}

// view all departments
async function viewDepartments() {
    try {
        const result = await pool.query('SELECT * FROM department');
        console.table(result.rows);
    } catch (error) {
        console.error('Error fetching departments. Try again.', error);
    }
}

//view all employees
async function viewAllEmployees() {
    try {
        const result = await pool.query('SELECT * FROM employee');
        console.table(result.rows);
    } catch (error) {
        console.error('Error fetching employees. Try again.', error);
    }
}

//view all roles
async function viewAllRoles() {
    try {
        const result = await pool.query('SELECT * FROM role');
        console.table(result.rows);
    } catch (error) {
        console.error('Error fetching roles. Try again.', error);
    }
}

//update employee role
async function updateEmployeeRole() {
    try {
        //get ALL the employees
        const employeesResult = await pool.query('SELECT id, first_name, last_name FROM employee');
        const employees = employeesResult.rows;
        // fetch ALL the roles
        const roleResult = await pool.query('SELECT id, title FROM role');
        const roles = roleResult.rows;

        if (employees.length === 0 || roles.length === 0) {
            console.error('No employees or roles available to update. Sorry!');
            return;
        }
        //prompt asking to select an employee
        const {employeeId} = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee you want to update',
                choices: employees.map(emp => ({
                    //emp is a parameter that represents each ind. employee object in the employees array
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                }))
            }
        ]);
        //prompt to select a new role
        const {newRoleId} = await inquirer.prompt([
            {
                type: 'list',
                name: 'newRoleId',
                message: 'Select the new role:',
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            }
        ]);
        //update employee's role in the database
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
        console.log('Employee role updated successfully! You did a great job!')
    } catch (error) {
        console.error('Error updating employee role.', error);
    }
}

//how the main menu looks/is setup
async function mainMenu() {
    const {action} = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do? :)',
            choices: ['View ALL Employees', 'View all Roles', 'View all Departments', 'Add Employee', 'Add Role', 'Add Department', 'Update an Employee Role', 'Exit']
        }
    ])
    switch(action) {
        case 'Add Department':
            await addDepartment();
            break;
        case 'View all Departments':
            await viewDepartments();
            break;
        case 'View All Employees':
            await viewAllEmployees();
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'Update an Employee Role':
            await updateEmployeeRole();
            break;
        case 'Exit':
            console.log('Thanks for participating! Until next time... or not ;)');
            process.exit(0);
    }
// go back to the main menu after you quit
await mainMenu();
}

//start this whole application
(async () => {
    await connectToDb(); //connects to my database
    await mainMenu(); //then this loads up the inquirer prompts on MM
}) ();