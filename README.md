git clone repo
pgadmin make ur password password
make the dbs
go to folder, then docker-compose up --build
open hasura localhost:8080/console - (the password is in dockercompose file supersecureadminsecret smth like that)
apply metadata found in the hasura_metadata file (just find the most updated one)
if not connected pa the postgres database kay connect it u can find the connection url in dockercompose file
go to vaycay-frontend folder, open console and npm run dev

## EmailJS Setup

To test the email system, follow these steps:

1. Create an account on [EmailJS](https://www.emailjs.com/).
2. Set up an email service and create a template.
3. Add the following environment variables to a `.env` file in the vaycay frontend directory:
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
