import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;
        console.log(token);
        
        // $gt is greater than operator
        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: {$gt: Date.now()} });

        if(!user) {
            return NextResponse.json({ error: "Invalid Token"}, { status: 400 });
        }

        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Email Verified successfully",
            success: true,
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}