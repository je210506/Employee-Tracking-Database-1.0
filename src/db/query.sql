SELECT *
FROM employee
JOIN role ON employee.role_id = role.id;

--join department, join manager name(self-join)