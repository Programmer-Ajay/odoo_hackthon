import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/model/user";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        
        let token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ "success": false, "message": "Unauthorized: No token provided" }, { status: 401 });
        }

        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            
            const user = await User.findById(decoded.id).select("-passwordHash"); // Exclude passwordHash

            if (!user) {
                return NextResponse.json({ "success": false, "message": "User not found" }, { status: 404 });
            }

            return NextResponse.json({
                "success": true,
                "user": user
            }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ "success": false, "message": "Unauthorized: Invalid token" }, { status: 401 });
        }

    } catch (error) {
        console.error("Get User Error:", error);
        return NextResponse.json({ "success": false, "message": "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        // 1. Verify the requester is authenticated (Admin or Manager usually create users)
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ "success": false, "message": "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ "success": false, "message": "Invalid token" }, { status: 401 });
        }

        const creator = await User.findById(decoded.id);
        if (!creator) {
            return NextResponse.json({ "success": false, "message": "Creator not found" }, { status: 404 });
        }

        if (creator.role !== 'Admin') {
            return NextResponse.json({ "success": false, "message": "Forbidden: Only Admins can create users" }, { status: 403 });
        }

        const { name, email, role, managerId } = await req.json();

        if (!name || !email || !role) {
            return NextResponse.json({ "success": false, "message": "Missing required fields" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ "success": false, "message": "User already exists" }, { status: 400 });
        }

        const newUser = await User.create({
            name,
            email,
            passwordHash: "pending_invite", // Placeholder until they set it via email invite
            role,
            companyId: creator.companyId,
            managerId: managerId || null,
        });

        return NextResponse.json({
            "success": true,
            "message": "User created successfully",
            "user": {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Create User Error:", error);
        return NextResponse.json({ "success": false, "message": "Internal Server Error" }, { status: 500 });
    }
}
