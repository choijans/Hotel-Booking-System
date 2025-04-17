#to start and build docker
docker compose up --build

#to start the app (run in vaycay frontend directory)
npm run dev 

#to stop docker 
control c
docker compose down

npm install



## EmailJS Setup

To test the email system, follow these steps:

1. Create an account on [EmailJS](https://www.emailjs.com/).
2. Set up an email service and create a template.
3. Add the following environment variables to a `.env` file in the vaycay frontend directory:
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
