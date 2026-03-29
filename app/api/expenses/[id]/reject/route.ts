import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/model/user";
import Expense from "@/model/expense";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };
        const user = await User.findById(decoded.id);
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        const resolvedParams = await params;
        const expenseId = resolvedParams.id;
        const expense = await Expense.findById(expenseId);
        if (!expense) return NextResponse.json({ success: false, message: "Expense not found" }, { status: 404 });

        if (expense.currentApproverId?.toString() !== user._id.toString() && user.role !== 'Admin') {
            return NextResponse.json({ success: false, message: "Not your turn to reject" }, { status: 403 });
        }

        const data = await req.json();
        
        // Add to history
        expense.approvalHistory.push({
            approverId: user._id,
            action: 'Rejected',
            comments: data.comments,
            actionDate: new Date()
        });

        // If any approver rejects, the whole expense is rejected
        expense.status = 'Rejected';
        expense.currentApproverId = undefined;

        await expense.save();
        return NextResponse.json({ success: true, expense });
    } catch (error) {
        console.error("Reject Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
