import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/model/user";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ "success": false, "message": "Email and password are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ "success": false, "message": "Invalid email or password" }, { status: 401 });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash); // Match schema: passwordHash

        if (!isPasswordMatch) {
            return NextResponse.json({ "success": false, "message": "Invalid email or password" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({
            "success": true,
            "message": "Signin successfully",
            "user": {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            }
        }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400 // 1 day
        });

        return response;

    } catch (error) {
        console.error("Signin Error:", error);
        return NextResponse.json({ "success": false, "message": "Internal Server Error" }, { status: 500 });
    }
}
