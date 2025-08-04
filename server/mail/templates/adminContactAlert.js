const adminContactAlert = (email, firstname, lastname, message, phoneNo, countrycode) => {
  return `
    <div style="max-width: 700px; margin: auto; padding: 20px; font-family: 'Segoe UI', sans-serif; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px;">
      <h2 style="color: #333333; text-align: center; margin-bottom: 20px;">📩 New Contact Form Submission</h2>

      <div style="background-color: #f1f3f5; padding: 20px; border-radius: 6px; margin-bottom: 15px;">
        <h3 style="color: #212529; margin-bottom: 12px;">👤 User Information</h3>
        <p style="margin: 6px 0; color: #495057;"><strong>Name:</strong> ${firstname} ${lastname}</p>
        <p style="margin: 6px 0; color: #495057;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 6px 0; color: #495057;"><strong>Phone:</strong> ${countrycode} ${phoneNo}</p>
      </div>

      <div style="background-color: #e9ecef; padding: 20px; border-radius: 6px;">
        <h3 style="color: #212529; margin-bottom: 12px;">📝 Message</h3>
        <p style="color: #495057; white-space: pre-wrap; line-height: 1.6;">${message}</p>
      </div>

      <div style="margin-top: 25px; text-align: center; font-size: 13px; color: #868e96;">
        <p>This message was submitted via the MindForge Contact Form</p>
        <p>📅 <em>${new Date().toLocaleString()}</em></p>
      </div>
    </div>
  `;
};

module.exports = { adminContactAlert };
