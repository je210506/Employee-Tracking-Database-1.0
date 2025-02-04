# Employee-Tracking-Database-1.0


## Description
Employee Tracker is a command-line application designed to help manage a company's employee database. Built with Node.js, Inquirer, and PostgreSQL, this application allows users to add, view, and update employee information, roles, and departments efficiently. It provides a streamlined interface for interacting with complex data without the need for a graphical user interface.


## Badge
None.


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Test Instructions](#testinstructions)
- [Questions](#questions)
   

## Installation 
1. Clone the Repository:
```
git clone <respository-SSH key>
cd employee-tracker
```
2. Install Dependencies:
    Make sure you have Node.js and PostgreSQL installed. Then run:
```
npm install
```
This will install the required packages, including:

```pg``` for PostgreSQL database

```inquirer``` for command-line prompts

3. Configure Environment Variables:
Create an ```.env``` file in the root directory:
```
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=employee_tracker
```

4. Set up the Database:
Run the provided SQL schema to create the necessary tables:
```
psql -U your_db_username  
\i schema.sql;
\i seed.sql;
```


## Usage 
1. Start the Application.
```
npm run start
```

2. Follow the Prompts:
Use the arrow Keys to navigate and select options.

3. Database Updates:
Each selection interacts with the PostgreSQL database to add, update, or retrieve employee information.

Video Example:
https://drive.google.com/file/d/15pRwoS7fx6uiYy6W3ZhUJ7ie2bI_vXQ9/view


## License 
This project is licensed under ${renderLicenseLink(answers.license)}. 


## Contributing 
Contributions are welcome! To contribute:
1. Fork the repository.

2. Create a new branch:
```
git checkout -b feature/yourFeature
```

3. Commit your changes:
```

git commit -m "Add new feature"
```

4. Push to your branch:
```

git push origin feature/yourFeature
```

5. Open a pull request for review.


## Test Instructions 
To test the application's functionality:

1. Ensure the database is running and populated with sample data.

2. Run the application and perform various operations:

    -Add new departments, roles, and employees.

    -Update existing employee roles.

    -View all departments, roles, and employees.

3. Verify the changes in the PostgreSQL database to ensure data integrity.


## Questions 
If there's any additional questions I can answer for you, you can reach out to me at https://github.com/je210506 or [lalanne1011@gmail.com](mailto:lalanne1011@gmail.com}).
