import { dataProducts } from "./data/products";
import prismaClient from "../src/libs/prismaClient";

async function main() {
  for (const product of dataProducts) {
    const newProductResult = await prismaClient.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
    console.info(`🆕 Product: ${newProductResult.name}`);
  }
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
