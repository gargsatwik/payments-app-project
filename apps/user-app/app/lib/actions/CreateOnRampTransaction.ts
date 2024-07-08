"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client";

export async function createOnRampTransaction(
  amount: number,
  provider: string
) {
  const token = (Math.random() * 100).toString();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!userId || !user) {
    return {
      message: "User not authorized",
    };
  }

  await db.onRampTransaction.create({
    data: {
      userId: Number(userId),
      amount: amount,
      startTime: new Date(),
      provider,
      status: "Processing",
      token: token,
    },
  });
  return {
    message: "On ramp transaction added",
  };
}
