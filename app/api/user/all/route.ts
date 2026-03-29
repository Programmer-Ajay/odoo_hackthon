import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/model/user";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };
        const admin = await User.findById(decoded.id);
        if (!admin || admin.role !== 'Admin') {
            return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
        }

        const users = await User.find({ companyId: admin.companyId }).select("-passwordHash");
        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error("Fetch All Users Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
