import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/User";

export const inngest = new Inngest({ id: "quickcart-next" });

// ✅ ১. User Creation Sync Function
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" }, // ১ম আর্গুমেন্ট: ID
  { event: "clerk/user.created" }, // ১ম আর্গুমেন্টের সাথে Event/Trigger দিতে হবে!
  async ({ event }) => {           // ২য় আর্গুমেন্ট: Handler Function
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);