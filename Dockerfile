# Use Bun image from the Docker Hub
FROM oven/bun:debian

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy app files
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile

# Generate Prisma
RUN bun run db:generate

# Run the application
CMD ["bun", "start"]
