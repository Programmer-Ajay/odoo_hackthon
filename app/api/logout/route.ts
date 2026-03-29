import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json({
            "success": true,
            "message": "Logged out successfully"
        }, { status: 200 });

        // Clear the token cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;

    } catch (error) {
        console.error("Logout Error:", error);
        return NextResponse.json({ "success": false, "message": "Internal Server Error" }, { status: 500 });
    }
}
