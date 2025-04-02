# 10xCards

## Project Description

10xCards is a web application designed for automatically generating flashcards using LLMs. It streamlines the process of creating high-quality flashcards from user-provided text, making learning more efficient and engaging. Users can generate flashcards automatically with AI or create and manage them manually.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Tech Stack

**Frontend:**
- Astro 5
- React 19
- TypeScript 5
- Tailwind CSS 4
- Shadcn/ui

**Backend:**
- Supabase (PostgreSQL) for data storage and authentication
- AI integration via OpenRouter.ai API

**CI/CD / Deployment:**
- GitHub Actions for continuous integration and deployment
- DigitalOcean for hosting using Docker images

## Getting Started Locally

1. **Clone the repository:**
   ```sh
   git clone https://github.com/przeprogramowani/10x-cards.git
   cd 10x-cards
   ```

2. **Ensure you are using the correct Node version:**
   This project uses the Node version specified in the `.nvmrc` file. Currently it's **22.14.0**.
   ```sh
   nvm use
   ```

3. **Install dependencies:**
   ```sh
   npm install
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Available Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm run preview`**: Previews the production build locally.
- **`npm run astro`**: Runs Astro CLI commands.
- **`npm run lint`**: Runs ESLint to check for linting issues.
- **`npm run lint:fix`**: Automatically fixes linting issues.
- **`npm run format`**: Formats the code using Prettier.

## Project Scope

The project aims to simplify flashcard creation by:

- Automatically generating flashcards using AI based on user-provided text.
- Allowing manual creation, editing, and management of flashcards.
- Supporting user account registration, login, and secure authentication using Supabase.
- Integrating with a spaced-repetition algorithm to optimize learning.
- Collecting usage statistics to assess the efficiency and quality of generated flashcards.

This MVP is designed to onboard 100 active users within the first three months and will evolve based on user feedback.

## Project Status

The project is currently in the MVP stage and under active development.

## License

This project is licensed under the MIT License.