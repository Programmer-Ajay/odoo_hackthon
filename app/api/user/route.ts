import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function GET(req: NextRequest) {
    try {
        let token = req.cookies.get("token")?.value;

        if (!token) {
            const authHeader = req.headers.get("authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return NextResponse.json({ "success": false, "message": "Unauthorized: No token provided" }, { status: 401 });
        }

        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            
            const user = await User.findById(decoded.id).select("-password");

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
