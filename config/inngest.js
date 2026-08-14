import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/User";

export const inngest = new Inngest({ id: "quickcart-next" });

// 1. Sync User Creation
export const syncUserCreation = inngest.createFunction(
    { 
        id: 'sync-user-from-clerk',
        event: 'clerk/user.created' // ✅ id এবং event একই অবজেক্টের ভেতর থাকবে
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url
        };

        await connectDB();
        await User.create(userData);
    }
);

// 2. Sync User Updation
export const syncUserUpdation = inngest.createFunction(
    { 
        id: 'update-user-from-clerk',
        event: 'clerk/user.updated' // ✅
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url
        };

        await connectDB();
        await User.findByIdAndUpdate(id, userData);
    }
);

// 3. Sync User Deletion
export const syncUserDeletion = inngest.createFunction(
    { 
        id: 'delete-user-with-clerk',
        event: 'clerk/user.deleted' // ✅
    },
    async ({ event }) => {
        const { id } = event.data;

        await connectDB();
        await User.findByIdAndDelete(id); // ⚠️ নোট: Delete করার জন্য findByIdAndDelete ব্যবহার করা ভালো
    }
);