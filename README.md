# React eKart - Modern Ecommerce Application

A modern, responsive ecommerce application built with React, TypeScript, and Microsoft Fluent UI Design System.

## Features

- 🛍️ **Product Catalog**: Browse products with advanced filtering and sorting
- 🛒 **Shopping Cart**: Add, remove, and manage items in your cart
- 💳 **Checkout Process**: Secure checkout with form validation
- 🎨 **Fluent UI Design**: Microsoft's modern design system with animations
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🔍 **Search & Filter**: Find products by name, category, and price
- ⚡ **Performance Optimized**: Fast loading with modern build tools
- 🧪 **Well Tested**: Comprehensive unit test coverage
- 🐳 **Containerized**: Docker support for easy deployment
- 🚀 **CI/CD Ready**: Azure DevOps pipeline configuration

## Tech Stack

- **Frontend**: React 18, TypeScript
- **UI Framework**: Microsoft Fluent UI
- **State Management**: Zustand
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **Linting**: ESLint, Prettier
- **Containerization**: Docker
- **CI/CD**: Azure DevOps

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Docker (for containerized development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-ekart-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development with Docker

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Access the application at [http://localhost:3000](http://localhost:3000)

### Development with DevContainer

1. Open the project in VS Code
2. Install the "Dev Containers" extension
3. Press `F1` and select "Dev Containers: Reopen in Container"
4. Wait for the container to build and start
5. Run `npm run dev` in the terminal

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── stores/             # State management
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── test/               # Test utilities and setup
└── assets/             # Static assets
```

## Testing

Run the test suite:

```bash
npm run test
```

Generate coverage report:

```bash
npm run test:coverage
```

## Deployment

The application includes:

- **Docker**: Containerized deployment
- **Azure DevOps**: CI/CD pipeline for automated builds and deployments
- **Production Build**: Optimized bundle for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
