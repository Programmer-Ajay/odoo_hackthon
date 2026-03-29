import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import axios from "axios";
import connectDB from "@/lib/db";
import User from "@/model/user";
import Expense from "@/model/expense";
import Company from "@/model/company";
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

        const query: Record<string, unknown> = { companyId: user.companyId };
        if (user.role === 'Employee') {
            query.userId = user._id;
        } else if (user.role === 'Manager') {
            query.$or = [
                { userId: user._id },
                { currentApproverId: user._id }
            ];
        }

        const expenses = await Expense.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, expenses });
    } catch (error) {
        console.error("Fetch Expenses Error:", error);
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
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        const data = await req.json();
        const rule = await ApprovalRule.findOne({ companyId: user.companyId });
        
        // Currency Conversion Logic
        const company = await Company.findById(user.companyId);
        let amountInBaseCurrency = data.amountSubmitted;
        
        if (company && data.currencySubmitted !== company.baseCurrency) {
            try {
                const { data: convData } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${data.currencySubmitted}`);
                const rate = convData.rates[company.baseCurrency];
                if (rate) {
                    amountInBaseCurrency = data.amountSubmitted * rate;
                }
            } catch (error) {
                console.error("Currency conversion failed, using original amount", error);
            }
        }

        let currentApproverId = null;
        if (user.managerId) {
            currentApproverId = user.managerId;
        } else if (rule && rule.assignedApprovers && rule.assignedApprovers.length > 0) {
            currentApproverId = rule.assignedApprovers[0];
        }

        // Fallback: If no rule exists and no direct manager is set, assign to an Admin
        if (!currentApproverId) {
            const adminUser = await User.findOne({ companyId: user.companyId, role: 'Admin' });
            if (adminUser) {
                currentApproverId = adminUser._id;
            }
        }

        const expense = await Expense.create({
            ...data,
            amountInBaseCurrency,
            userId: user._id,
            companyId: user.companyId,
            status: 'Pending',
            appliedRuleId: rule?._id,
            currentApproverId: currentApproverId,
            approvalHistory: []
        });

        return NextResponse.json({ success: true, expense });
    } catch (error) {
        console.error("Expense Submission Error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
