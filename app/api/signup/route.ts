import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const ready = data.name && data.email && data.password && data.country;
        if (!ready) {
            return NextResponse.json({ "success": false, "message": "Please fill all the fields" }, { status: 400 })
        }
        const { name, email, password, country } = data;

        const company = await Company.create({
            name: `${name}'s Company`,
            country,
        })
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "Admin",
            company_id: company._id,
            country,
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
                country: user.country
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
