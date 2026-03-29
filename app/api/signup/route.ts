import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Company from "@/model/company";
import User from "@/model/user";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const data = await req.json();
        const ready = data.name && data.email && data.password && data.country && data.baseCurrency;
        if (!ready) {
            return NextResponse.json({ "success": false, "message": "Please fill all the fields" }, { status: 400 })
        }
        const { name, email, password, country, baseCurrency } = data;

        const company = await Company.create({
            name: `${name}'s Company`,
            country,
            baseCurrency, 
        })
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            name,
            email,
            passwordHash: hashedPassword, 
            role: "Admin",
            companyId: company._id, 
            isManagerApprover: true // Admin is always an approver by default
        })

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({ 
            "success": true, 
            "message": "Signup successfully",
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
        console.error("Signup Error:", error);
        return NextResponse.json({ "success": false, "message": "Internal Server Error", "error": error }, { status: 500 })
    }
}
