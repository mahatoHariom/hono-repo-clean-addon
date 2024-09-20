# Nakama API

This is a simple Nakama's API built using **[Hono.js](https://hono.dev)**, **[Prisma ORM](https://www.prisma.io)**, and documented with **[OpenAPI Swagger](https://swagger.io/specification/)**. It provides endpoints to retrieve data from the database for Nakama's store.

## Features

- **Product Management**: Managing one-piece merchandise products, including creating, updating, and retrieving product information.
- **Category Management**: Managing product categories, including creating, updating, and retrieving category information.
- **Order Management**: Managing orders, including creating, updating, and retrieving order information.
- **Search and Filtering**: Searching and filtering products based on various criteria, such as price, category, and stock availability.

## Tech Stacks

- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [PostreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Zod](https://hono.dev/examples/zod-openapi)
- [SwaggerUI](https://hono.dev/examples/swagger-ui)

## Installation

Follow these steps to get your Nakama API up and running:

1. Clone the repository and install the required dependencies:

   ```bash
   git clone https://github.com/yourusername/nakama-api.git
   cd nakama-api
   bun install
   ```

2. Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/nakama
   ```

3. Run the migrations:

   ```bash
   bunx  prisma migrate dev
   ```

4. Start the server:

   ```bash
   bun run dev
   ```

5. Open your browser and navigate to `http://localhost:3100/api` to access the API documentation.

## Contributing

Contributions are welcome! To contribute to this project, please follow these steps:

1. Fork the repository on GitHub.
2. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature/YourFeatureName
   git commit -m "Add some feature"
   git push origin feature/YourFeatureName


   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
