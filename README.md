# Nakama API

This is a simple Nakama's API built using **[Hono.js](https://hono.dev)**, **[Prisma ORM](https://www.prisma.io)**, and documented with **[OpenAPI Swagger](https://swagger.io/specification/)**. It provides endpoints to retrieve data from the database for Nakama's store.

## Features

- Built with Hono.js for fast and efficient routing.
- Utilizes Prisma ORM for seamless database interactions.
- Comprehensive API documentation generated with OpenAPI Swagger.

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
