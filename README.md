School Fees Manager

Description
This is a project that looks to solve the problem of fees management for school Administrators.
 It helps to monitor the payment progress of each child in the school. Now this is great 
because from the comfort from your home or office you can easily track payment progress 
and have accurate data of cash inflow into the school account. Also you get to manage different
branches of your school if you have more than one branch.
You get to create Add a new school, class and student from your dashboard.

Built with
    -   Python -> Primary Language for logic implememntation.
    -   Python Flask -> As the backend framework.
    -   Javascript/HTML/CSS -> Frontend rendering and dynamic contents.
    -   MySQL -> Database storage.
    -   SQLAlchemy -> ORM for data storage.
    -   Git -> Version control.

Getting started
    Dependencies
    - Python 3.9.10 -> [$ sudo apt-get install python3] (for Linux os)
    - flask -> [$ pip install flask]
    - flask_login -> [$ pip install flask-login]
    - MySQL
    - SQLAlchemy -> [$ pip install flask-sqlalchemy]
    - bcrypt -> [$ pip install bcrypt]

Installing
    Simply fork this repository to your local machine

Execute Program
    You will need to firstly create a mysql database on your local machine. 
    If you are using a non-root user to access the database, be sure to 
    grant all privileges to this user on that database.
    Now to run the command, the following environmanetal variabes should be set;
        - FEES_MAN_USER -> This should be set to the database user
        - FEES_MAN_PASSWORD -> This should be set to the password associated with 
          the database user
        - FEES_MAN_HOST -> This should be set to Localhost if your database is 
          hosted on your local machine. Else specify the ip address for your database.
        - FEES_MAN_DBNAME -> This should be set to the name for the database you created 
          earlier
        - FEES_SECRET_KEY -> Set this secret key to whatever you like but be sure to keep it
          consistent.
        - FLASK_APP -> Set this to "api/v1/app"
    Finally you can run the command "flask run" in your terminal. Be sure to run it from the 
    projects root directory.
    Example:
        FEES_MAN_USER=myuser FEES_MAN_PASSWORD=mypwd FEES_MAN_HOST=localhost FEES_MAN_DBNAME=mydb FEES_SECRET_KEY=mysecretkey FLASK_APP=api/v1/app flask run
    
Usage
    Now that you have your server running, go to your browser and type "http://127.0.0.1:5000/signup".
    This would take you to a signup page which would create an account for you to have a user experience.
    Next you login and you can now create a school, class or student.
    To create a school, click on the "Register school" button at the top left of the school. 
    <p><img src="screenshots/home.png" width="350"></p>
    This step is required to create a classroom or a student.