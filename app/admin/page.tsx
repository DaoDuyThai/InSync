"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { toast } from "sonner";

const AdminPage = () => {
  const [totalUsersCount, setTotalUsersCount] = React.useState(0);
  const [activeUsers, setActiveUsers] = React.useState(0);
  const [signUps, setSignUps] = React.useState(0);
  const [signIns, setSignIns] = React.useState(0);

  const [recentSignIns, setRecentSignIns] = React.useState([]);

  const fetTotalUsers = async () => {
    try {
      const response = await fetch(`https://api.clerk.com/v1/user/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTotalUsersCount(data.total_count);
      } else {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };

  React.useEffect(() => {
    // fetTotalUsers();
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto py-4">
      <h2>Users</h2>
      <div className="grid grid-cols-4 gap-4 py-4">
        <div className="col-span-1 gap-4 flex flex-col ">
          <div className="rounded-lg border flex flex-col h-[150px] justify-start p-6 gap-1">
            <div className="text-xl font-semibold">
              Total users
            </div>
            <div>
              All time
            </div>
            <div className="text-4xl font-semibold pt-2">
              50
            </div>
          </div>
          <div className="rounded-lg border flex flex-col h-[150px] justify-start p-6 gap-1">
            <div className="text-xl font-semibold">
              Active users
            </div>
            <div>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </div>
            <div className="text-4xl font-semibold pt-2">
              50
            </div>
          </div>
          <div className="rounded-lg border flex flex-col h-[150px] justify-start p-6 gap-1">
            <div className="text-xl font-semibold">
              Sign-ups
            </div>
            <div>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </div>
            <div className="text-4xl font-semibold pt-2">
              50
            </div>
          </div>
          <div className="rounded-lg border flex flex-col h-[150px] justify-start p-6 gap-1">
            <div className="text-xl font-semibold">
              Sign-ins
            </div>
            <div>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </div>
            <div className="text-4xl font-semibold pt-2">
              50
            </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col rounded-lg border h-full justify-start p-6 gap-2">
          <div className="text-xl font-semibold">
            Recent sign ins
          </div>
          <div className="">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-bold">
                    Đào Duy Thái
                  </div>
                  <div>
                    dduythai.ddt@gmail.com
                  </div>
                </div>
              </div>
              <div className="text-sm">
                Thu Nov 14
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;