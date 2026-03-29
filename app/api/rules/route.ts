import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/model/user";
import ApprovalRule from "@/model/approvalRule";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };
        const user = await User.findById(decoded.id);
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        const rules = await ApprovalRule.find({ companyId: user.companyId });
        return NextResponse.json({ success: true, rules });
    } catch (error) {
        console.error("Fetch Rules Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };
        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'Admin') {
            return NextResponse.json({ success: false, message: "Only Admin can create rules" }, { status: 403 });
        }

        const data = await req.json();
        const rule = await ApprovalRule.create({
            ...data,
            companyId: user.companyId
        });

        return NextResponse.json({ success: true, rule });
    } catch (error) {
        console.error("Create Rule Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error", error }, { status: 500 });
    }
}
