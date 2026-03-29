import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";
import connectDB from "@/lib/db";
import User from "@/model/user";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL!;

sgMail.setApiKey(SENDGRID_API_KEY);

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // 1. Verify the requester is an Admin
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ "success": false, "message": "Unauthorized" }, { status: 401 });
        }

        let decoded: { id: string, email: string, role: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string, role: string };
        } catch (error) {
            console.error("Token verification failed", error);
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        const admin = await User.findById(decoded.id);
        if (!admin || admin.role !== 'Admin') {
            return NextResponse.json({ "success": false, "message": "Forbidden: Only Admins can invite users" }, { status: 403 });
        }

        // 2. Get user email from request body
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json({ "success": false, "message": "Email is required" }, { status: 400 });
        }

        // 3. Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ "success": false, "message": "User not found" }, { status: 404 });
        }

        // 4. Generate a unique random password
        const randomPassword = crypto.randomBytes(8).toString('hex'); // 16 character hex password
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // 5. Update user passwordHash in DB
        user.passwordHash = hashedPassword;
        await user.save();

        // 6. Send email using SendGrid
        const msg = {
            to: email,
            from: FROM_EMAIL,
            subject: 'Welcome to the Team - Your Account Credentials',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Welcome to the Team!</h2>
                    <p>Hi ${user.name},</p>
                    <p>Your account has been created by your administrator. You can now log in to the platform using the credentials below:</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 10px 0 0 0;"><strong>Password:</strong> <span style="color: #e74c3c; font-weight: bold;">${randomPassword}</span></p>
                    </div>
                    <p>For security reasons, we recommend that you change your password after your first login.</p>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/signin" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
                    </div>
                    <p style="margin-top: 30px; font-size: 12px; color: #777;">If you did not expect this email, please ignore it or contact your administrator.</p>
                </div>
            `,
        };

        try {
            await sgMail.send(msg);
            console.log(`Invite email sent to ${email}`);
        } catch (error) {
            console.error("SendGrid Error:", error);
            return NextResponse.json({ success: false, message: "Failed to send invitation email" }, { status: 500 });
        }

        return NextResponse.json({
            "success": true,
            "message": "Invitation email sent successfully with unique password"
        }, { status: 200 });

    } catch (error) {
        console.error("Invite User Error:", error);
        return NextResponse.json({ "success": false, "message": "Internal Server Error" }, { status: 500 });
    }
}
