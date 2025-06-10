# RMIT Library FotoWare Explorer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)

A modern web application for exploring and managing digital learning objects through the FotoWare Digital Asset Management System. Built with Next.js and TypeScript, this application provides an intuitive interface for RMIT Library staff to manage and access digital learning resources.

#### © RMIT University Library

###### Developed by RMIT Library Digital Learning

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Resources](#resources)

## Features

- 🔍 Basic search functionality for archives and assets
- 🖼️ Asset preview with metadata display
- 🌓 Dark/Light theme support
- 📱 Responsive design for all devices
- 🎨 Modern UI with Shadcn components
- 📊 Basic metadata management
- 📚 Archive organisation and browsing
- 🎯 Basic filtering capabilities
- 🔒 Cultural sensitivity controls

## Tech Stack

- **Framework:** Next.js 15.3
- **Language:** TypeScript
- **Styling:** TailwindCSS 4.1.8
- **UI Components:** Radix UI & Shadcn
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Animations:** Framer Motion
- **Search:** Fuse.js
- **Image Processing:** Sharp
- **3D Viewing:** Google Model Viewer

## Prerequisites

- Node.js (v18.x or later)
- npm (v9.x or later) or yarn (v1.22.x or later)
- Git
- FotoWare DAM System access
- FotoWare API credentials

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd LOR-FotoWareExplorer-App
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Configuration

1. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

2. Configure the following environment variables:
```env
# FotoWare Configuration
NEXT_PUBLIC_FOTOWARE_API_URL=your_fotoware_api_url
NEXT_PUBLIC_FOTOWARE_CLIENT_ID=your_client_id
NEXT_PUBLIC_FOTOWARE_CLIENT_SECRET=your_client_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Development

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/          # Next.js app router pages and routes
├── components/   # Reusable UI components
├── lib/          # Utility functions and shared logic
├── hooks/        # Custom React hooks
├── types/        # TypeScript type definitions
├── styles/       # Global styles and Tailwind configuration
└── scripts/      # Build and utility scripts
```

## Contributing

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git commit -m "feat: your feature description"
```

3. Push to your branch:
```bash
git push origin feature/your-feature-name
```

4. Submit a pull request

### Development Guidelines

- Follow the [TypeScript style guide](https://google.github.io/styleguide/tsguide.html)
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Update documentation for any new features

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contact

- Project Contact: Dr Lisa Cianci ([lisa.cianci@rmit.edu.au](mailto:lisa.cianci@rmit.edu.au))
- Developer Contact: Karl Ervine ([karl.ervine@rmit.edu.au](mailto:karl.ervine@rmit.edu.au))
- Repo Admin: Jack Dunstan ([jack.dunstan@rmit.edu.au](mailto:jack.dunstan@rmit.edu.au))
- Additional Contact: [digital.learning.library@rmit.edu.au](mailto:digital.learning.library@rmit.edu.au)

## Resources

- [Active RMIT Library GitHub](https://github.com/RMITLibrary)
- [Archived RMIT Library GitHub](https://github.com/RMITLibrary-Archived)
- [FotoWare API Documentation](https://learn.fotoware.com/02_FotoWare_APIs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
