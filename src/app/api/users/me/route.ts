import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDB();

export async function POST(request: NextRequest) {
    const userId = await getDataFromToken(request); // act as middleware
    // the select field is not included
    const user   = await User.findById(userId).select("-password");

    if(!user) {
        return NextResponse.json({
            message: "Token invalid",
            success: false
        }, { status: 400 });
    }

    return NextResponse.json({
        message: "User found",
        data: user,
    })
};