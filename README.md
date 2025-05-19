Steps to run the system:
1. Git Clone Repo
2. Ensure Docker, Postgresql, pgAdmin is installed 
3. Go to pgadmin and ensure that the username is "postgres" and password is "password" 
4. Create the following databases in pgAdmin: auth_db, guest_db, room_booking_db, payment_db
5. Npm install in the folder to install all required dependencies
6. run the "run_all_services.sh" by going to git bash and entering "bash run_all_services.sh" (This will start the frontend and backend services at once)
7. Open Hasura Console in your browser with the link: localhost:8080/console
8. If it asks for a password, the password is "supersecureadminsecret"
9. Go to the data tab and create each database by putting the correct database name (same as the ones in pgadmin) 
10. Connect each database with the environment variables/connection variables found in the docker-compose.yml file in line 74-77
11. Manually input each SQL Code to create the tables which can be found in the migrations folder. (Input it in the data SQL tab and make sure you put the right sql code for each database)
12. Apply metadata found in the hasura_metadata_2025 JSON file 
13. Open frontend in browser with link: localhost:5173/
14. Register new user

For Admin Side: (TWO WAYS)
(first way)
1. Manually create an admin in the data tab in the hasura console
2. For the password, make sure you first hash the plain text password yourself through this link:
https://bcrypt-generator.com/
3. Ensure that the role is "admin". no uppercase
4. Admin logs into the system through the same login form.  

(second way)
1. Register an account as a user with all their details
2. Go to the data tab to the auth_db and simply change the role from "user" to "admin".

## EmailJS Setup

To test the email system, follow these steps:

1. Create an account on [EmailJS](https://www.emailjs.com/).
2. Set up an email service and create a template.
3. Add the following environment variables to a `.env` file in the vaycay frontend directory:
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
