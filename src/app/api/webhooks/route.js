import { db } from "@/lib/firebase";
import { ref, set } from "firebase/database";

import { Webhook } from "svix";
import { headers } from "next/headers";
import {} from "@clerk/nextjs/server";

export async function POST(req) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

  try {
    console.log("Headers:", req.headers);
    console.log("Method:", req.method);
    // const textBody = await req.text(); // Use `.text()` to see the raw body
    // console.log("Raw Body:", textBody);
    // const body = JSON.parse(req.body); // Manually parse to catch issues
    console.log("Parsed Body:", body);

    let parsedbody = JSON.parse(body);
    // if (body.object === "user") {
    console.log("body ", parsedbody);
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      phone_numbers,
      public_metadata,
    } = parsedbody.data;

    console.log({
      id,
      first_name,
      last_name,
      email_addresses,
      phone_numbers,
      public_metadata,
    });

    const userData = {
      clerkId: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses[0]?.email_address || null,
      phone: phone_numbers[0]?.phone_number || null,
      address: public_metadata?.address || null,
    };

    await set(ref(db, "users/" + id), userData);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
    // } else {
    //   return new Response(JSON.stringify({ error: "Invalid object type" }), {
    //     status: 400,
    //   });
    // }
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(JSON.stringify({ error: "Internal-Server Error" }), {
      status: 500,
    });
  }
}
