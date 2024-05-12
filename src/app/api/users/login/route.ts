import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        // find user
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'Invalid user' }, { status: 400 });
        }
        console.log(user);

        const validPass = await bcryptjs.compare(password, user.password);
        if (!validPass) {
            return NextResponse.json({ error: "Check your credentials." }, { status: 400 });
        }

        const jwtToken = await jwt.sign({ id: user._id }, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

        const response = NextResponse.json({
            message: "Loggged in successfully.",
            success: true,
        }, { status: 200 });

        response.cookies.set("token", jwtToken, {
            httpOnly: true
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}