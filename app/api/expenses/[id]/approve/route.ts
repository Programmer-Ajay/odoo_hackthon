import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/model/user";
import Expense from "@/model/expense";
import ApprovalRule from "@/model/approvalRule";

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
            return NextResponse.json({ success: false, message: "Not your turn to approve" }, { status: 403 });
        }

        const data = await req.json();
        const rule = await ApprovalRule.findById(expense.appliedRuleId);
        
        // Add to history
        expense.approvalHistory.push({
            approverId: user._id,
            action: 'Approved',
            comments: data.comments,
            actionDate: new Date()
        });

        // Determine next status/approver
        const submitter = await User.findById(expense.userId);
        const isSubmitterManager = submitter && submitter.managerId?.toString() === user._id.toString();

        if (rule) {
            if (isSubmitterManager && rule.assignedApprovers.length > 0) {
                // To avoid sending to the same person if the manager is ALSO the first approver in the rule
                if (rule.assignedApprovers[0].toString() === user._id.toString()) {
                    if (rule.assignedApprovers.length > 1) {
                        expense.currentApproverId = rule.assignedApprovers[1];
                    } else {
                        expense.status = 'Approved';
                        expense.currentApproverId = undefined;
                    }
                } else {
                    expense.currentApproverId = rule.assignedApprovers[0];
                }
            } else if (rule.ruleType === 'Sequential') {
                const currentIndex = rule.assignedApprovers.findIndex(id => id.toString() === user._id.toString());
                if (currentIndex !== -1 && currentIndex < rule.assignedApprovers.length - 1) {
                    expense.currentApproverId = rule.assignedApprovers[currentIndex + 1];
                } else {
                    expense.status = 'Approved';
                    expense.currentApproverId = undefined;
                }
            } else if (rule.ruleType === 'Percentage') {
                const approvedCount = expense.approvalHistory.filter(h => h.action === 'Approved').length;
                const threshold = (rule.percentageThreshold || 0) / 100;
                if (approvedCount / rule.assignedApprovers.length >= threshold) {
                    expense.status = 'Approved';
                    expense.currentApproverId = undefined;
                } else {
                    // Stay pending
                }
            } else if (rule.ruleType === 'SpecificApprover') {
                if (user._id.toString() === rule.specificApproverId?.toString()) {
                    expense.status = 'Approved';
                    expense.currentApproverId = undefined;
                }
            } else if (rule.ruleType === 'Hybrid') {
                // Combine logic
            } else {
                expense.status = 'Approved';
                expense.currentApproverId = undefined;
            }
        } else {
            // No rule, just manager approve is enough
            expense.status = 'Approved';
            expense.currentApproverId = undefined;
        }

        await expense.save();
        return NextResponse.json({ success: true, expense });
    } catch (error) {
        console.error("Approve Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
