import { NextRequest } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
  }

  // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: Record<string, unknown>;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as Record<string, unknown>;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const data = evt.data as Record<string, unknown>;
    const { id, email_addresses, first_name, last_name } = data;
    const userId = id as string;

    try {
      // 既存ユーザーのチェック
      const existingUser = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            clerkId: userId,
            email: (email_addresses as Array<{ email_address: string }>)?.[0]?.email_address || "",
            name: `${(first_name as string) || ""} ${(last_name as string) || ""}`.trim(),
            role: "MEMBER", // デフォルトでメンバー権限を付与
          },
        });

        console.log(`User created via webhook: ${(email_addresses as Array<{ email_address: string }>)?.[0]?.email_address}`);
      } else {
        console.log(`User already exists: ${(email_addresses as Array<{ email_address: string }>)?.[0]?.email_address}`);
      }
    } catch (error) {
      console.error("Error creating user via webhook:", error);
    }
  }

  if (eventType === "user.updated") {
    const data = evt.data as Record<string, unknown>;
    const { id, email_addresses, first_name, last_name } = data;
    const userId = id as string;

    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

      if (existingUser) {
        await prisma.user.update({
          where: {
            clerkId: userId,
          },
          data: {
            email: (email_addresses as Array<{ email_address: string }>)?.[0]?.email_address || existingUser.email,
            name: `${first_name || ""} ${last_name || ""}`.trim() || existingUser.name,
          },
        });

        console.log(`User updated via webhook: ${(email_addresses as Array<{ email_address: string }>)?.[0]?.email_address}`);
      } else {
        // ユーザーが存在しない場合は新規作成
        await prisma.user.create({
          data: {
            clerkId: userId,
            email: (email_addresses as Array<{ email_address: string }>)?.[0]?.email_address || "",
            name: `${(first_name as string) || ""} ${(last_name as string) || ""}`.trim(),
            role: "MEMBER",
          },
        });

        console.log(`User created via webhook (update event): ${(email_addresses as Array<{ email_address: string }>)?.[0]?.email_address}`);
      }
    } catch (error) {
      console.error("Error updating user via webhook:", error);
    }
  }

  if (eventType === "user.deleted") {
    const data = evt.data as Record<string, unknown>;
    const { id } = data;
    const userId = id as string;

    try {
      await prisma.user.delete({
        where: {
          clerkId: userId,
        },
      });

      console.log(`User deleted: ${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return new Response("", { status: 200 });
}
