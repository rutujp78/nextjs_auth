import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from '@/models/user';

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // todo: configure mail for usage
    console.log(email, emailType, userId);
    // here to string is imp because userId is like : new ObjectId('l;df') instead of 'l;df'
    // it includes special chars '$,etc' whos encoding is diff and causes bugs in productions
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000
      });
    }
    else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000
      });
    }

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ce0f4e709e64aa",
        pass: "1b87fdf75f2957"
      }
    });

    const emailHTML = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === 'VERIFY' ? "verify your email" : "reset your password"} or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`;

    const mailOptions = {
      from: 'darkraider.th1@gmail.com',
      to: email,
      subject: emailType === 'VERIFTY' ? "Verfiy your email" : "Reset your password",
      // text: "Hello world?", // plain text body
      html: emailHTML,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
}