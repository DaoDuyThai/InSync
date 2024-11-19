import { useAuth } from "@clerk/nextjs";

const { getToken } = useAuth();
const jwt = await getToken({ template: "InSyncRoleToken" });
if (!jwt) {
    throw new Error("Failed to retrieve JWT token.");
}
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/projects/project-user-clerk-is-publish/${user.id}`,
    {
        headers: {
            "Content-Type": "application/json",
            "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
            "x-api-key": jwt,
        }
    }
);



{
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 7e92bd34-b9d4-49ba-9dcf-00b39bbeee24`,
              "jwt": jwt,
            }
          }