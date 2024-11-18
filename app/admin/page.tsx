"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { toast } from "sonner";
import RevenueChart from "./_components/revenue-chart";

type User = {
  last_sign_in_at?: number;
  last_active_at: number;
  created_at?: number;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  email_addresses?: { email_address: string }[]; // Array of objects with an email_address field
}

type dailyData = {
  date: string;
  gross: number;
  net: number;
  newCustomers: number;
  mrr: number;
  churnRate: number;
  avgRevenuePerCustomer: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
}

type totals = {
  gross: number;
  net: number;
  newCustomers: number;
  currentMRR: number;
  avgChurnRate: number;
  customerLifetimeValue: number;
  activeSubscriptions: number;
}

type revenueData = {
  daily: dailyData[];
  totals: totals;
}

const AdminPage = () => {


  const [users, setUsers] = React.useState<User[]>([]);
  const [totalUsersCount, setTotalUsersCount] = React.useState(0);
  const [activeUsers, setActiveUsers] = React.useState(0);
  const [signUpsUsers, setSignUpsUsers] = React.useState(0);
  const [revenueData, setRevenueData] = React.useState<revenueData | null>(null);
  const [recentSignIns, setRecentSignIns] = React.useState<User[]>([]);
  const [dailyData, setDailyData] = React.useState<dailyData[]>([]);
  const [totals, setTotals] = React.useState<totals | null>(null);

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/stripe-volumes');
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data);
        setDailyData(data.daily);
        setTotals(data.totals);
      } else {
        console.error('Error fetching revenue data from proxy:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/clerk-users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Error fetching user count from proxy:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  React.useEffect(() => {
    fetchUsers();
    fetchRevenueData();
  }, []);

  // React.useEffect(() => {
  //   if (revenueData) {
  //     setDailyData(revenueData.daily);
  //     setTotals(revenueData.totals);
  //   }
  // }, [revenueData]);


  React.useEffect(() => {
    if (users.length > 0) {
      setTotalUsersCount(users.length);
    }

    // Get the start of the current month in epoch
    const startOfMonth = new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1);
    const startOfMonthEpoch = startOfMonth.getTime();

    // Filter users who have signed in or were active since the start of the month
    const activeUsersThisMonth = users.filter(user => {
      const lastActive = user.last_sign_in_at || user.last_active_at; // consider both last sign-in and last active time
      return lastActive !== undefined && lastActive >= startOfMonthEpoch;
    });

    // Set the count of active users
    setActiveUsers(activeUsersThisMonth.length);

    // Filter sign-up users who joined since the start of the month
    const signUpUsersThisMonth = users.filter(user => {
      const signUpDate = user.created_at;
      return signUpDate !== undefined && signUpDate >= startOfMonthEpoch;
    });

    setSignUpsUsers(signUpUsersThisMonth.length);

    // Get the recent sign-ins, sorted by most recent, limiting to top 5
    setRecentSignIns(users
      .filter(user => user.last_sign_in_at !== undefined)
      .sort((a, b) => (b.last_sign_in_at ?? 0) - (a.last_sign_in_at ?? 0)) // Sort by last_sign_in_at descending
      .slice(0, 8)); // Limit to the top 8 most recent sign-ins

  }, [users]);



  return (
    <div className="w-full h-full overflow-y-auto py-4">
      <h2 className="text-3xl font-bold">Participations</h2>
      <div className="grid grid-cols-4 gap-4 py-4">
        <div className="col-span-1 gap-4 flex flex-col ">
          <div className="rounded-lg border flex flex-col h-full justify-start p-6 gap-1">
            <div className="text-xl font-semibold">
              Total users
            </div>
            <div>
              All time
            </div>
            <div className="text-4xl font-semibold pt-2">
              {totalUsersCount}
            </div>
          </div>
          <div className="rounded-lg border flex flex-col h-full justify-start p-6 gap-1">
            <div className="text-xl font-semibold">
              Active users
            </div>
            <div>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </div>
            <div className="text-4xl font-semibold pt-2">
              {activeUsers}
            </div>
          </div>
          <div className="rounded-lg border flex flex-col h-full justify-start p-6 gap-1">
            <div className="text-xl font-semibold">
              Sign-ups
            </div>
            <div>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </div>
            <div className="text-4xl font-semibold pt-2">
              {signUpsUsers}
            </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col rounded-lg border h-full justify-start p-6 gap-2">
          <div className="text-xl font-semibold">
            Recent sign ins
          </div>
          <div className="">
            {recentSignIns.map((user) => (

              <div key={user.profile_image_url} className="flex justify-between items-center py-2">
                <div className="flex gap-2 items-center">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.profile_image_url} alt="@shadcn" />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-bold">
                      {user.last_name} {user.first_name}
                    </div>
                    <div>
                      {user.email_addresses?.[0].email_address}
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  {new Date(user.last_active_at).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <h2 className="text-3xl font-bold py-4">Revenue</h2>
      <div className="grid grid-cols-5 gap-4 h-fit">
        <div className="col-span-4">
          <RevenueChart />
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border flex flex-col justify-start p-6 gap-1 h-1/2">
            <div className="text-xl font-semibold">
              New Customers
            </div>
            <div className="">
              Last 30 days
            </div>
            <div className="text-4xl font-semibold pt-2">
              {totals?.newCustomers}
            </div>
          </div>
          <div className="rounded-lg border flex flex-col justify-start p-6 gap-1 h-1/2">
            <div className="text-xl font-semibold">
              Active Subscriptions
            </div>
            <div className="">
              Last 30 days
            </div>
            <div className="text-4xl font-semibold pt-2">
              {totals?.activeSubscriptions}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default AdminPage;