# Self-Help Goal Setting and Roadmap Generator

## Description

This application is a comprehensive self-help tool designed to assist users in setting goals, creating personalized roadmaps, and tracking their progress. Built with JigsawStacks' AI-powered APIs, Next.js and Prisma, it offers a robust and user-friendly interface for personal development.

## Features

- User authentication and personalized dashboards
- Goal creation and management
- Automated roadmap generation for each goal
- Visual representation of goals and roadmaps
- Progress tracking and status updates

## Technologies Used

- JigsawStack
- Next.js 14
- TypeScript
- Prisma ORM
- PostgreSQL
- TailwindCSS
- NextAuth.js for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/self-help-app.git
   ```

2. Navigate to the project directory:
   ```
   cd self-help-app
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Set up your environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   DATABASE_URL="your_postgresql_database_url"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   JIGSAW_STACK_API_KEY="your_jigsaw_stack_api_key"
   ```

5. Run database migrations:
   ```
   npx prisma migrate dev
   ```

6. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Sign up for an account or log in
2. Create a new goal from your dashboard
3. Generate a roadmap for your goal
4. View and track your progress on the goal details page

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to the JigsawStack team for providing the amazing AI-powered roadmap generation
- Next.js team for the fantastic framework
- Prisma team for the excellent ORM

