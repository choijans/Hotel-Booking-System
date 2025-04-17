import { useRef } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then((result) => {
        console.log(result.text);
        alert('Message sent successfully!');
        form.current.reset(); // Reset the form after successful submission
    }, (error) => {
        console.log(error.text);
        alert('Failed to send the message, please try again.');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Get in touch Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-beige-600 text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-gray-900 mr-2 pt-6">Get in Touch with</span>
          <img
            src="/src/assets/Logo.png"
            alt="Vacay"
            className="h-24 w-auto align-middle"
          />
        </div>
        <p className="text-xl text-gray-600 mx-auto">
          We're here to help you plan your perfect vacation. Reach out to our team with any questions.
        </p>
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Send us a message section */}
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Send us a message</h2>
            <p className="text-black mb-8">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-black">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              
              <div>
                  <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                  Submit Message
                  </button>
              </div>
            </form>
          </div>

          {/* Other ways to contact section */}
          <div className="text-black p-8 rounded-lg max-w-90" style={{ backgroundColor: '#DDF1F0' }}>
            <h2 className="text-2xl font-bold mb-6 text-teal-600">Other Ways to Contact</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium">Customer Support</h3>
                <p className="mt-2">support@vacay.com</p>
                <p className="mt-1">1-800-VACAY-HELP</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Business Inquiries</h3>
                <p className="mt-2">partners@vacay.com</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Office Address</h3>
                <p className="mt-2">
                  123 Beach Boulevard<br />
                  Miami, FL 33139
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Office Hours</h3>
                <p className="mt-2">
                  Monday - Friday: 9am - 6pm EST<br />
                  Saturday: 10am - 2pm EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;