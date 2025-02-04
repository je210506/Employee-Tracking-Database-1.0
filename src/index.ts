import inquirer from 'inquirer';
import {pool, connectToDb} from './db/connection.js';

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
        const existingDepartmentResult = await pool.query('SELECT * FROM department WHERE name = $1', [departmentName]);

        if(existingDepartmentResult.rows.length >0) {
            console.log(`Department ${departmentName} already exists.`);
            return;
        }
        await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
        console.log(`Department "${departmentName}" was added successfully! YAY!`);
    } catch (error) {
        console.log('Error adding department. Yikes!', error);
    }
}

//add employee
async function addEmployee() {
    try {
        //get roles from the database
        const rolesResult = await pool.query('SELECT id, title FROM role');
        const roles = rolesResult.rows;

        const managersResult = await pool.query('SELECT id, first_name, last_name FROM employee');
        const managers = managersResult.rows;
        //find the managers(existing employees)
        const {firstName, lastName, roleID, managerID} = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the employee\'s first name:',
                validate: (input) => input.trim() !== '' || 'First name cannot be empty.' 
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the employee\'s last name:',
                validate: (input) => input.trim() !== '' || 'Last name cannot be empty.'
            },
            {
                type: 'list',
                name: 'roleID',
                message: 'Select the role for the new employee:',
                choices: roles.map(role => ({
                    name: role.title,
                    value: role.id
                }))
            },
            {
                type: 'list',
                name: 'managerID',
                message: 'Select the manager for the new employee:',
                choices: [
                    {name: 'none', value: null},
                    ...managers.map(manager => ({
                        name: `${manager.first_name} ${manager.last_name}`,
                        value: manager.id
                    }))
                ]
            }
        ]);

        //insert new employee into my database
        await pool.query(
            'INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
            [firstName, lastName, roleID, managerID]
        );
        console.log(`The new employee "${firstName} ${lastName}" was added successfully! Yay!`);
    } catch (error) {
        console.error('Error adding the new employee. Try again.', error);
    }
}

//add role // add salary and department ID
async function addRole() {
    try {
        const departments = await pool.query('SELECT * FROM department;');
        const { title, salary, department_id } = await inquirer.prompt([
          { type: 'input', name: 'title', message: 'Enter role title:' },
          { type: 'input', name: 'salary', message: 'Enter salary:', validate: input => !isNaN(input) || 'Please enter a valid number' },
          { type: 'list', name: 'department_id', message: 'Select department:', choices: departments.rows.map((d: { name: any; id: any; }) => ({ name: d.name, value: d.id })) }
        ]);
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);', [title, parseFloat(salary), department_id]);
        console.log(`Role "${title}" added!`);
      } catch (err) {
        console.error('Error adding role:', err);
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
        const result = await pool.query(`
            SELECT
                e.id AS employee_id,
                e.first_name,
                e.last_name,
                r.title AS role,
                d.name AS department,
                r.salary,
                e.manager_id,
                CONCAT(m.first_name, ' ', m.last_name) AS manager_name
            FROM employee e
            JOIN role r ON e.role_id = r.id
            JOIN department d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
            `);
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
            choices: ['View all Employees', 'View all Roles', 'View all Departments', 'Add Employee', 'Add Role', 'Add Department', 'Update an Employee Role', 'Exit']
        }
    ])
    switch(action) {
        case 'Add Department':
            await addDepartment();
            break;
        case 'View all Departments':
            await viewDepartments();
            break;
        case 'View all Employees':
            await viewAllEmployees();
            break;
        case 'View all Roles':
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