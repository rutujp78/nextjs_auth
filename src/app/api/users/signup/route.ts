import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import { sendEmail } from "@/helpers/mailer";

connectDB();
// localhost:3000/api/users/signup route hai, same as directory path
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        // add validations
        console.log(reqBody);

        const user = await User.findOne({ email });

        if(user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPass = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPass,
        })

        const savedUser = await newUser.save();
        console.log(savedUser);
        
        // send verification email
        console.log("sending email");
        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

        return NextResponse.json({
            message: "User register successfully, kindly verify your email",
            success: true,
            savedUser,
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}