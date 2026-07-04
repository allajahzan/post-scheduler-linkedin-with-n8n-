import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export async function DELETE() {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const userId = new ObjectId(session.userId);

    // Calculate 3-day rolling quota to prevent loophole
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const recentPostsCount = await db.collection("posts").countDocuments({ 
      user_id: userId,
      created_at: { $gte: threeDaysAgo }
    });

    if (recentPostsCount >= 3) {
      return NextResponse.json(
        { message: "Cannot delete account while quota is reached. Please wait for your quota to reset." },
        { status: 403 }
      );
    }

    // Delete user's posts
    await db.collection("posts").deleteMany({ user_id: userId });

    // Delete user's notifications
    await db.collection("notifications").deleteMany({ user_id: userId });

    // Delete user account
    await db.collection("users").deleteOne({ _id: userId });

    // Clear session to logout
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
