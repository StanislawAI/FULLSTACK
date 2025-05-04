'use client'; // This marks the component as a Client Component, enabling client-side interactivity

import { useState } from 'react'; // Importing React's useState hook to manage component state
import { supabase } from '../../../lib/supabaseClient'; // Importing our Supabase client to interact with the database

export default function ContactPage() {
  // State variables to store and update form data
  const [name, setName] = useState(''); // State for the name input field
  const [email, setEmail] = useState(''); // State for the email input field
  const [message, setMessage] = useState(''); // State for the message textarea
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission status
  
  // State for displaying success/error messages
  const [formStatus, setFormStatus] = useState<{
    message: string; // The message to show the user
    isError: boolean; // Whether it's an error (red) or success (green)
  } | null>(null); // Initially null (no message shown)

  // Function that runs when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    // Form validation - check if any field is empty
    if (!name || !email || !message) {
      setFormStatus({
        message: 'Please fill out all fields', // Error message to display
        isError: true // This is an error message
      });
      return; // Exit the function early
    }
    
    setIsSubmitting(true); // Set loading state to show "Sending..." button text
    
    try {
      // Insert the form data into the 'contacts' table in Supabase
      const { error } = await supabase
        .from('contacts') // Target the contacts table
        .insert([{ name, email, message }]); // Insert a new row with the form data
        
      if (error) throw error; // If Supabase returns an error, throw it to be caught below
      
      // If successful, clear the form
      setName('');
      setEmail('');
      setMessage('');
      
      // Show success message
      setFormStatus({
        message: 'Message sent successfully!',
        isError: false // This is a success message (green)
      });
    } catch (error) {
      // Handle any errors during submission
      console.error('Error submitting form:', error); // Log the error for debugging
      setFormStatus({
        message: 'Something went wrong. Please try again.',
        isError: true // This is an error message (red)
      });
    } finally {
      // Whether successful or not, we're no longer submitting
      setIsSubmitting(false); // Reset the loading state
    }
  };

  // The UI of the component
  return (
    <main className="p-8 max-w-xl mx-auto"> {/* Container with padding and max width */}
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1> {/* Page title */}
      
      {/* Conditional rendering: Show status message only if formStatus exists */}
      {formStatus && (
        <div className={`p-4 mb-6 rounded ${formStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {formStatus.message} {/* Display success/error message */}
        </div>
      )}
      
      {/* Form element with submit handler and styling */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input field group */}
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name} // Controlled component - value from state
            onChange={(e) => setName(e.target.value)} // Update state when input changes
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required // HTML validation
          />
        </div>
        
        {/* Email input field group */}
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email" // Email input type provides basic format validation
            id="email"
            value={email} // Controlled component - value from state
            onChange={(e) => setEmail(e.target.value)} // Update state when input changes
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required // HTML validation
          />
        </div>
        
        {/* Message textarea field group */}
        <div>
          <label htmlFor="message" className="block mb-1 font-medium">
            Message
          </label>
          <textarea
            id="message"
            value={message} // Controlled component - value from state
            onChange={(e) => setMessage(e.target.value)} // Update state when input changes
            rows={5} // Height of the textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required // HTML validation
          />
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting} // Disable the button while submitting
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'} {/* Change button text based on submission state */}
        </button>
      </form>
    </main>
  );
}