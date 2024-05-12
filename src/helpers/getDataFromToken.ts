import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import { sendEmail } from "@/helpers/mailer";
import jwt from 'jsonwebtoken';

connectDB();

export async function getDataFromToken(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value || "";
        const id: any = await jwt.verify(token, process.env.TOKEN_SECRET!);
        
        return id.id;
    } catch (error: any) {
        throw new Error(error.message);
    }
}