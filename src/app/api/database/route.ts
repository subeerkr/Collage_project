// app/api/database/route.ts

import { countUsers } from "../../../lib/userStore";

export async function GET() {
  try {
    const userCount = await countUsers();

    // Provide lightweight info
    return new Response(
      JSON.stringify({
        success: true,
        message: "User store accessible",
        orm: "file-store",
        stats: { userCount },
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[api/database] ❌ Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err), timestamp: new Date().toISOString() }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
