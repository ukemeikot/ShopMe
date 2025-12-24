import { Inngest } from "inngest";
import { connectDatabase} from "./database.js";

export const inngest = new Inngest({id:"shopMe"});

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event}) => {
        await connectDatabase();
        const {id:email_addresses, first_name, last_name, imageUrl} = event.data;

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address || "",
            name: `${first_name || ""} ${last_name || ""}` || "User",
            imageUrl: imageUrl || "",
            addresses: [],
            wishlist: [],
        }

        await User.create(newUser);
    }
)

const deleteUser = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},
    async ({event}) => {
        await connectDatabase();
        const {id} = event.data;
        await User.deleteOne({clerkId: id});
    }
);
export const functions = [syncUser, deleteUser]