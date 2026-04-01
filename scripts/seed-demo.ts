import { businesses, customers, rewards } from "@/lib/data/demo";

async function main() {
  console.log(
    JSON.stringify(
      {
        businesses: businesses.length,
        customers: customers.length,
        rewards: rewards.length
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
