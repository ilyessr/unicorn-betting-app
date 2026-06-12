import {
  BetStatus,
  BetType,
  PaymentStatus,
  PrismaClient,
  RaceStatus,
} from "@prisma/client";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { cwd, loadEnvFile } from "node:process";

for (const envFilePath of [join(cwd(), "backend/.env"), join(cwd(), ".env")]) {
  if (existsSync(envFilePath)) {
    loadEnvFile(envFilePath);
  }
}

const prisma = new PrismaClient();

const unicorns = [
  ["Twilight Sparkle", "#c084fc"],
  ["Rainbow Dash", "#60a5fa"],
  ["Pinkie Pie", "#f9a8d4"],
  ["Rarity", "#e9d5ff"],
  ["Fluttershy", "#fde68a"],
  ["Applejack", "#f59e0b"],
  ["Princess Celestia", "#fff7ed"],
  ["Princess Luna", "#818cf8"],
  ["Starlight Glimmer", "#d8b4fe"],
  ["Sunset Shimmer", "#fb7185"],
  ["Trixie Lulamoon", "#93c5fd"],
  ["Princess Cadance", "#f0abfc"],
] as const;

function buildTodayRaceStarts(now: Date) {
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(now);
  dayEnd.setHours(23, 59, 59, 999);

  const futureOpenStarts = [10, 20, 30]
    .map(
      (offsetInMinutes) =>
        new Date(now.getTime() + offsetInMinutes * 60 * 1000),
    )
    .filter((startsAt) => startsAt < dayEnd);

  if (futureOpenStarts.length < 3) {
    const remainingMs = dayEnd.getTime() - now.getTime();
    [0.25, 0.5, 0.75].forEach((ratio) => {
      const startsAt = new Date(
        now.getTime() + Math.floor(remainingMs * ratio),
      );
      if (startsAt > now && startsAt < dayEnd) {
        futureOpenStarts.push(startsAt);
      }
    });
  }

  const regularRaceMinutes = [
    9 * 60,
    10 * 60 + 15,
    11 * 60 + 30,
    12 * 60 + 45,
    14 * 60,
    15 * 60 + 15,
    16 * 60 + 30,
    17 * 60 + 45,
    19 * 60,
    20 * 60 + 15,
    21 * 60 + 30,
    22 * 60 + 45,
  ];

  const raceStartsByTime = new Map<number, Date>();
  futureOpenStarts
    .sort((a, b) => a.getTime() - b.getTime())
    .slice(0, 3)
    .forEach((startsAt) => raceStartsByTime.set(startsAt.getTime(), startsAt));

  for (const minute of regularRaceMinutes) {
    if (raceStartsByTime.size >= 10) break;
    const startsAt = new Date(dayStart);
    startsAt.setMinutes(minute);
    raceStartsByTime.set(startsAt.getTime(), startsAt);
  }

  return Array.from(raceStartsByTime.values()).sort(
    (a, b) => a.getTime() - b.getTime(),
  );
}

async function main() {
  await prisma.productEvent.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.betSelection.deleteMany();
  await prisma.bet.deleteMany();
  await prisma.raceEntry.deleteMany();
  await prisma.race.deleteMany();
  await prisma.unicorn.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "camille@example.com",
        name: "Camille Martin",
        balance: 120,
      },
    }),
    prisma.user.create({
      data: { email: "annie@example.com", name: "Annie Dalgo", balance: 80 },
    }),
    prisma.user.create({
      data: { email: "leo@example.com", name: "Léo Garnier", balance: 240 },
    }),
  ]);

  const createdUnicorns = await Promise.all(
    unicorns.map(([name, color], index) =>
      prisma.unicorn.create({
        data: {
          name,
          color,
          victories:
            name === "Rainbow Dash" ? 42 : Math.floor((index * 7) % 11),
        },
      }),
    ),
  );

  const now = new Date();
  const raceStarts = buildTodayRaceStarts(now);

  for (let raceIndex = 0; raceIndex < raceStarts.length; raceIndex += 1) {
    const startsAt = raceStarts[raceIndex];
    const bettingOpen = new Date(startsAt.getTime() - 2 * 60 * 60 * 1000);
    const status =
      now >= startsAt
        ? RaceStatus.CLOSED
        : now >= bettingOpen
          ? RaceStatus.OPEN
          : RaceStatus.SCHEDULED;

    const race = await prisma.race.create({
      data: {
        name: `Grand Prix Licorne ${raceIndex + 1}`,
        startsAt,
        bettingOpen,
        status,
      },
    });

    const runners = createdUnicorns.slice(raceIndex % 4, (raceIndex % 4) + 8);
    await Promise.all(
      runners.map((unicorn, lane) =>
        prisma.raceEntry.create({
          data: {
            raceId: race.id,
            unicornId: unicorn.id,
            lane: lane + 1,
            finishRank: status === RaceStatus.CLOSED ? lane + 1 : null,
          },
        }),
      ),
    );

    if (raceIndex < 4) {
      const betType =
        raceIndex % 3 === 0
          ? BetType.WINNER
          : raceIndex % 3 === 1
            ? BetType.TOP_3
            : BetType.TOP_5;
      const selectionCount =
        betType === BetType.WINNER ? 1 : betType === BetType.TOP_3 ? 3 : 5;
      const bet = await prisma.bet.create({
        data: {
          userId: users[raceIndex % users.length].id,
          raceId: race.id,
          type: betType,
          amount: 10 + raceIndex * 5,
          potentialWin:
            (10 + raceIndex * 5) *
            (betType === BetType.WINNER
              ? 4.5
              : betType === BetType.TOP_3
                ? 2.4
                : 1.6),
          status: raceIndex % 2 === 0 ? BetStatus.WON : BetStatus.LOST,
          selections: {
            create: runners
              .slice(0, selectionCount)
              .map((unicorn, position) => ({
                unicornId: unicorn.id,
                position: position + 1,
              })),
          },
        },
      });

      await prisma.payment.create({
        data: {
          betId: bet.id,
          amount: bet.amount,
          cardLast4: "4242",
          providerRef: `seed_${raceIndex}`,
          status: PaymentStatus.CAPTURED,
          authorizedAt: new Date(),
          capturedAt: new Date(),
        },
      });
    }
  }

  await prisma.productEvent.createMany({
    data: [
      { userId: users[0].id, name: "view", target: "race-list" },
      { userId: users[0].id, name: "click", target: "bet-submit" },
      { userId: users[1].id, name: "view", target: "bettor-dashboard" },
      { userId: users[1].id, name: "click", target: "bet-type-top-3" },
      { name: "view", target: "product-dashboard" },
      { name: "click", target: "refresh-kpis" },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
