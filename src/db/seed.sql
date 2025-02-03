DO $$

DECLARE
    --Variable declarations go here
BEGIN

INSERT INTO department (id, name)
VALUES
    (1, 'Operations'),
    (2, 'Finance'),
    (3, 'Accounting');

INSERT INTO role (id, title, salary, department_id)
VALUES
    (180, 'Financial Officer', 80000, 1),
    (181, 'Budget Analyst', 75000, 2),
    (182, 'Bookkeeper',70000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1021, 'Heif', 'Letland', 180, NULL),
    (1022, 'Jenny', 'Lalanne', 181, 1021),
    (1023, 'China', 'Pochette', 182, 1021); 

RAISE NOTICE 'TRANSACTION COMPLETED :)';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occured %:', SQLERRM;
        ROLLBACK; 

END $$;