const contactUsEmail = (email, firstname, lastname, message, phoneNo, countrycode) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MindForge Contact Form Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05); font-family: 'Segoe UI', sans-serif;">
              <tr>
                <td style="background-color: #343a40; color: #ffffff; padding: 30px 20px; text-align: center;">
                  <h2 style="margin: 0; font-size: 24px;">Thank You for Contacting Us!</h2>
                  <p style="margin: 5px 0 0;">We've received your message 🎉</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 20px;">
                  <h3 style="color: #333333; margin-bottom: 15px;">Submitted Details</h3>
                  <p style="color: #555;"><strong>Name:</strong> ${firstname} ${lastname}</p>
                  <p style="color: #555;"><strong>Email:</strong> ${email}</p>
                  <p style="color: #555;"><strong>Phone:</strong> ${countrycode} ${phoneNo}</p>

                  <div style="margin-top: 25px;">
                    <h3 style="color: #333333; margin-bottom: 10px;">Your Message</h3>
                    <p style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; color: #555; line-height: 1.6;">
                      ${message}
                    </p>
                  </div>

                  <p style="margin-top: 30px; font-size: 14px; color: #888;">We’ll get back to you as soon as possible. Meanwhile, stay curious and keep innovating 🚀</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f1f1f1; padding: 20px; text-align: center;">
                  <p style="color: #777; font-size: 13px;">MindForge • Contact Form Confirmation</p>
                  <p style="color: #aaa; font-size: 12px;">Submitted on: ${new Date().toLocaleString()}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

module.exports = { contactUsEmail };
