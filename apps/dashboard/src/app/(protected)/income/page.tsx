import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getPayments } from "./_actions";
import { filterByTypes } from "./_utils";
import { cn } from "@/lib/utils";
import { ChartPanel } from "./components/ChartPanel";
import { UpdateButton } from "./components/UpdateButton";
import { redirectIfNotSignedIn } from "@/lib/auth";

export const dynamic = "force-dynamic";

const PaymentsType = ({ value, children }: { value: string; children: string }) => (
  <TabsTrigger
    className={cn(
      "cursor-pointer px-2 text-lg text-white",
      "data-[state=active]:bg-white",
      "data-[state=active]:font-bold",
      "data-[state=active]:text-black",
    )}
    value={value}
  >
    {children}
  </TabsTrigger>
);

async function Page() {
  await redirectIfNotSignedIn();

  const payments = await getPayments();
  const donationsAndSubscriptions = filterByTypes(payments, ["subscription", "donation"]);
  const donations = filterByTypes(payments, ["donation"]);
  const subscriptions = filterByTypes(payments, ["subscription"]);

  return (
    <Tabs
      defaultValue="all"
      className="flex h-full w-full flex-col"
    >
      <TabsList className="mx-auto mb-6 grid h-auto w-[600px] grid-cols-3 bg-black/90">
        <PaymentsType value="all">Tout</PaymentsType>
        <PaymentsType value="subscriptions">Abonnements</PaymentsType>
        <PaymentsType value="donations">Dons</PaymentsType>
        <UpdateButton />
      </TabsList>
      {/* All */}
      <TabsContent
        className="grow overflow-auto"
        value="all"
      >
        <ChartPanel
          payments={donationsAndSubscriptions}
          type="all"
        />
      </TabsContent>
      {/* Subscriptions */}
      <TabsContent
        className="grow overflow-auto"
        value="subscriptions"
      >
        <ChartPanel
          payments={subscriptions}
          type="subscriptions"
        />
      </TabsContent>
      {/* Donations */}
      <TabsContent
        className="grow overflow-auto"
        value="donations"
      >
        <ChartPanel
          payments={donations}
          type="donations"
        />
      </TabsContent>
    </Tabs>
  );
}

export default Page;
