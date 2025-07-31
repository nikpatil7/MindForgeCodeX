import React from "react";
import ContactUsForm from "../../core/ContactUsPage/ContactUsForm";

const ContactFormSection = () => {
  return (
    <section className="w-full py-12 bg-richblack-900">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-center text-4xl font-bold text-richblack-5">Get in Touch</h1>
        <p className="text-center text-lg text-richblack-300 mt-3">
          We'd love to hear from you. Please fill out this form.
        </p>
        <div className="mt-12">
          <ContactUsForm />
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
