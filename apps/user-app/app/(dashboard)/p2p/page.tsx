import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { Transactions } from "../../../components/Transactions";
import { authOptions } from "../../lib/auth";
import db from "@repo/db/client";

async function getTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await db.p2pTransfer.findMany({
    where: {
      id: Number(session?.user?.id),
    },
  });
  return txns.map((t) => ({
    time: t.timeStamp,
    amount: t.amount,
  }));
}

export default async function () {
  const transactions = await getTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        p2p Transfers
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <SendCard />
        </div>
        <div>
          <div className="pt-4">
            <Transactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
