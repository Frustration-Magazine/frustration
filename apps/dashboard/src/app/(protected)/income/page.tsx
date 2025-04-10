import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs";
import { getPayments } from "./_actions";
import Panel from "./components/Panel";
import Chart from "./components/Chart";
import { filterByTypes } from "./_utils";

export const dynamic = "force-dynamic";

const payments = await getPayments();

const PaymentsType = ({ value, children }: { value: string; children: string }) => (
  <TabsTrigger
    className="px-2 text-lg data-[state=active]:bg-gray-200 data-[state=active]:font-bold data-[state=active]:text-black"
    value={value}
  >
    {children}
  </TabsTrigger>
);

const Tab = ({ value, children }: { value: string; children: string }) => (
  <TabsTrigger
    className="bg-black py-2 font-bebas text-4xl font-bold uppercase leading-tight text-yellow data-[state=inactive]:opacity-30"
    value={value}
  >
    {children}
  </TabsTrigger>
);

/* ************** */
/*     🚀 UI      */
/* ************** */
const IncomePage = () => {
  const donationsAndSubscriptions = filterByTypes(payments, ["subscription", "donation"]);
  const donations = filterByTypes(payments, ["donation"]);
  const subscriptions = filterByTypes(payments, ["subscription"]);

  return (
    <Tabs defaultValue="permanent" className="flex h-full w-full flex-col overflow-auto">
      <TabsList className="mx-auto mb-3 grid h-fit w-[400px] grid-cols-1 gap-2 bg-transparent">
        <Tab value="permanent">Global</Tab>
      </TabsList>
      <TabsContent className="mx-auto grow overflow-auto" value="permanent">
        <Tabs defaultValue="all" className="flex h-full flex-col">
          <TabsList className="mx-auto mb-6 grid h-auto w-[600px] grid-cols-3">
            <PaymentsType value="all">Tout</PaymentsType>
            <PaymentsType value="subscriptions">Abonnements</PaymentsType>
            <PaymentsType value="donations">Dons</PaymentsType>
          </TabsList>
          <TabsContent className="grow overflow-auto" value="all">
            <section className="flex h-full gap-6">
              <Panel name="Tout" payments={donationsAndSubscriptions} />
              <Chart payments={donationsAndSubscriptions} />
            </section>
          </TabsContent>
          <TabsContent className="grow overflow-auto" value="subscriptions">
            <section className="flex h-full gap-6">
              <Panel name="Abonnements" payments={subscriptions} />
              <Chart payments={subscriptions} />
            </section>
          </TabsContent>
          <TabsContent className="grow overflow-auto" value="donations">
            <section className="flex h-full gap-6">
              <Panel name="Dons" payments={donations} />
              <Chart payments={donations} />
            </section>
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
};

export default IncomePage;
