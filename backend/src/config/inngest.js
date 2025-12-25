import { Inngest } from "inngest";
import { connectDatabase } from "./database.js";
import User from "../models/user.model.js"; // Adjust path if needed

export const inngest = new Inngest({ id: "shopMe" });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "user.created" },
    async ({ event, step }) => {
        return await step.run('sync-user-to-db', async () => {
            try {
                console.log('🔵 Starting user sync:', event.data);
                
                await connectDatabase();
                
                // ✅ CORRECT destructuring - don't rename id
                const { id, email_addresses, first_name, last_name, image_url } = event.data;

                const newUser = {
                    clerkId: id, // ✅ Now id exists
                    email: email_addresses[0]?.email_address || "",
                    name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
                    imageUrl: image_url || "",
                    addresses: [],
                    wishlist: [],
                };

                console.log('💾 Creating user in DB:', newUser);
                const createdUser = await User.create(newUser);
                console.log('✅ User created successfully:', createdUser._id);
                
                return { success: true, userId: id };
            } catch (error) {
                console.error('❌ Error in syncUser:', error);
                throw error;
            }
        });
    }
);

const deleteUser = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "user.deleted" },
    async ({ event, step }) => {
        return await step.run('delete-user-from-db', async () => {
            try {
                console.log('🔵 Starting user deletion:', event.data);
                
                await connectDatabase();
                
                const { id } = event.data;
                
                const result = await User.deleteOne({ clerkId: id });
                console.log('✅ User deleted:', result);
                
                return { success: true, userId: id, deletedCount: result.deletedCount };
            } catch (error) {
                console.error('❌ Error in deleteUser:', error);
                throw error;
            }
        });
    }
);

export const functions = [syncUser, deleteUser];