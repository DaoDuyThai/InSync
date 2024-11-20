"use client";

import * as React from "react";
import { Pencil, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

type SubscriptionPlan = {
  id: string,
  subscriptionsName: string,
  status: boolean,
  price: number,
  userId: string,
  userIdGuid: string,
  displayName: string,
  content: string,
  dateCreated: string,
  dateUpdated: string | null,
  maxProjects: number,
  maxAssets: number,
  maxScenarios: number,
  maxUsersAccess: number,
  storageLimit: number,
  supportLevel: "Standard" | "Advanced",
  customFeaturesDescription: string,
  dataRetentionPeriod: number,
  prioritySupport: boolean,
  monthlyReporting: boolean
}

const SubscriptionsPage = () => {
  const [subscriptionPlans, setSubscriptionPlans] = React.useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchSubscriptionPlans = async () => {
    const jwt = await getToken({ template: "InSyncRoleToken" });
    if (!jwt) {
      throw new Error("Failed to retrieve JWT token.");
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptionplans/pagination`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
            Authorization: `Bearer ${jwt}`,
          }
        }
      );
      if (!response.ok) throw new Error("Failed to fetch subscription plans");
      const data = await response.json();
      setSubscriptionPlans(data.data);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (subscriptionPlanId: string, updatedSubscriptionPlan: Partial<SubscriptionPlan>) => {
    setIsLoading(true);
    try {
      const jwt = await getToken({ template: "InSyncRoleToken" });
      if (!jwt) {
        throw new Error("Failed to retrieve JWT token.");
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptionplans/${subscriptionPlanId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(updatedSubscriptionPlan),
      });
      if (!response.ok) throw new Error("Failed to update subscription plan.");
      toast.success("Subscription plan updated successfully!");
      fetchSubscriptionPlans();
    } catch (error) {
      console.error("Error updating subscription plan:", error);
      toast.error("Failed to update subscription plan.");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("ID copied to clipboard!");
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error("Failed to copy ID.");
    });
  };

  React.useEffect(() => {
    fetchSubscriptionPlans();
  }, [isLoading]);

  if (loading) {
    return
    <Loading />;
  }

  return (
    <div className="w-full h-full overflow-x-auto p-4">
      <Table className="text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-black">Property</TableHead>
            {subscriptionPlans.map((plan) => (
              <TableHead key={plan.id}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(plan.id)}
                  title="Copy ID"
                  className="w-full font-black"
                >
                  {plan.subscriptionsName}

                  <Eye className="h-4 w-4 ml-2" />
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-center">Price</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>đ{plan.price.toFixed(3)}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Description</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.content}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Max Projects</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.maxProjects}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Max Assets</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.maxAssets}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Max Scenarios</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.maxScenarios}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Storage Limit (blocks/scenario)</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.storageLimit}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Support Level</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.supportLevel}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Custom Features</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.customFeaturesDescription}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Data Retention (days)</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.dataRetentionPeriod}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Priority Support</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.prioritySupport ? "Yes" : "No"}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Monthly Reporting</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.monthlyReporting ? "Yes" : "No"}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Date Created</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{new Date(plan.dateCreated).toLocaleString()}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Date Updated</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>{plan.dateUpdated ? new Date(plan.dateUpdated).toLocaleString() : 'N/A'}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Actions</TableCell>
            {subscriptionPlans.map((plan) => (
              <TableCell key={plan.id}>
                <EditDialog
                  plan={plan}
                  onEdit={handleEdit}
                  isLoading={isLoading}
                  open={open && selectedPlanId === plan.id} // Open the dialog for the selected plan
                  setOpen={(isOpen) => {
                    if (isOpen) {
                      setSelectedPlanId(plan.id); // Set the selected plan ID when the dialog is opened
                    } else {
                      setSelectedPlanId(null); // Reset the selected plan ID when the dialog is closed
                    }
                    setOpen(isOpen);
                  }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

interface EditDialogProps {
  plan: SubscriptionPlan;
  onEdit: (id: string, updatedPlan: Partial<SubscriptionPlan>) => Promise<void>;
  isLoading: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ plan, onEdit, isLoading, open, setOpen }) => {
  const [editedPlan, setEditedPlan] = React.useState(plan);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2 w-full">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Subscription Plan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subscriptionsName" className="text-right">Name</Label>
            <Input
              id="subscriptionsName"
              value={editedPlan.subscriptionsName}
              onChange={(e) => setEditedPlan({ ...editedPlan, subscriptionsName: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price</Label>
            <Input
              id="price"
              type="number"
              value={editedPlan.price}
              onChange={(e) => setEditedPlan({ ...editedPlan, price: parseFloat(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">Description</Label>
            <Input
              id="content"
              value={editedPlan.content}
              onChange={(e) => setEditedPlan({ ...editedPlan, content: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxProjects" className="text-right">Max Projects</Label>
            <Input
              id="maxProjects"
              type="number"
              value={editedPlan.maxProjects}
              onChange={(e) => setEditedPlan({ ...editedPlan, maxProjects: parseInt(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxAssets" className="text-right">Max Assets</Label>
            <Input
              id="maxAssets"
              type="number"
              value={editedPlan.maxAssets}
              onChange={(e) => setEditedPlan({ ...editedPlan, maxAssets: parseInt(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxScenarios" className="text-right">Max Scenarios</Label>
            <Input
              id="maxScenarios"
              type="number"
              value={editedPlan.maxScenarios}
              onChange={(e) => setEditedPlan({ ...editedPlan, maxScenarios: parseInt(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="storageLimit" className="text-right">Storage Limit</Label>
            <Input
              id="storageLimit"
              type="number"
              value={editedPlan.storageLimit}
              onChange={(e) => setEditedPlan({ ...editedPlan, storageLimit: parseInt(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supportLevel" className="text-right">Support Level</Label>
            <Select
              value={editedPlan.supportLevel}
              onValueChange={(value) => setEditedPlan({ ...editedPlan, supportLevel: value as "Standard" | "Advanced" })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select support level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customFeaturesDescription" className="text-right">Custom Features</Label>
            <Input
              id="customFeaturesDescription"
              value={editedPlan.customFeaturesDescription}
              onChange={(e) => setEditedPlan({ ...editedPlan, customFeaturesDescription: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataRetentionPeriod" className="text-right">Data Retention Period</Label>
            <Input
              id="dataRetentionPeriod"
              type="number"
              value={editedPlan.dataRetentionPeriod}
              onChange={(e) => setEditedPlan({ ...editedPlan, dataRetentionPeriod: parseInt(e.target.value) })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prioritySupport" className="text-right">Priority Support</Label>
            <Switch
              id="prioritySupport"
              checked={editedPlan.prioritySupport}
              onCheckedChange={(checked) => setEditedPlan({ ...editedPlan, prioritySupport: checked })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="monthlyReporting" className="text-right">Monthly Reporting</Label>
            <Switch
              id="monthlyReporting"
              checked={editedPlan.monthlyReporting}
              onCheckedChange={(checked) => setEditedPlan({ ...editedPlan, monthlyReporting: checked })}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-center">
          <Button onClick={() => onEdit(plan.id, editedPlan)} disabled={isLoading}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SubscriptionsPage;