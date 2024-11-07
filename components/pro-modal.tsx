import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/store/use-pro-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { Loading } from "./loading";

const font = Poppins({
  subsets: ['latin'],
  weight: ["400", "500", "600", "700"],
});

type SubscriptionPlan = {
  id: string,
  subscriptionsName: string,
  status: boolean,
  price: number,
  userId: string,
  content: string,
  dateCreated: string,
  dateUpdated: string,
  maxProjects: number,
  maxAssets: number,
  maxScenarios: number,
  maxUsersAccess: number,
  storageLimit: number,
  supportLevel: string,
  customFeaturesDescription: string,
  dataRetentionPeriod: number,
  prioritySupport: boolean,
  monthlyReporting: boolean,
  user: string | null,
  userSubscriptions: Array<any> | null,
}

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [SubscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);

  const fetchPricingPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/SubscriptionPlans`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubscriptionPlans(data);
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
      toast.error("Something went wrong. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const handleUpgradeClick = () => {
    setPending(true);

    if (!user) {
      toast.error("Please log in to continue.");
      setPending(false);
      return;
    }
    try {
      const paymentLinkUrl = `${process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL!}?prefilled_email=${user.primaryEmailAddress}&subscription_plan_id=${SubscriptionPlans[1].id}&userIdClerk=${user.id}`;
      window.location.href = paymentLinkUrl;
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
      return
    } finally {
      setPending(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/pro.svg" alt="pro" className="object-fit" fill />
        </div>
        <div className={cn("text-neutral-700 mx-auto space-y-6 p-6", font.className)}>
          <h2 className="font-medium text-lg">🚀 Upgrade to InSync Professional today!</h2>
          <div className="pl-3">
            {
              SubscriptionPlans.length === 0 && loading ? <Loading /> : (
                <ul className="text-md space-y-1 list-disc">
                  <li>Price: {SubscriptionPlans[1].price}/month</li>
                  <li>Max Projects: {SubscriptionPlans[1].maxProjects}</li>
                  <li>Max Scenarios: {SubscriptionPlans[1].maxScenarios}</li>
                  <li>Support Level: {SubscriptionPlans[1].supportLevel}</li>
                  <li>{SubscriptionPlans[1].customFeaturesDescription}</li>
                </ul>
              )
            }
          </div>
          <Button onClick={handleUpgradeClick} disabled={pending} size="sm" className="w-full">
            {pending ? "Loading..." : "Upgrade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
