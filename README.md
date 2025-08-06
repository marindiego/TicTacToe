# Tic Tac Toe Game

A modern implementation of the classic Tic Tac Toe game built with React, TypeScript, and Tailwind CSS.

## Overview

This project is a practice exercise focused on building an interactive Tic Tac Toe game with a clean and modern UI. Players can compete against a CPU opponent in a classic game of X's and O's.

## Key Features

- **Player Selection**: Choose between X or O as your game marker
- **CPU Opponent**: Play against an AI opponent with randomized moves
- **Responsive Design**: Fully responsive layout that works on all screen sizes
- **Game State Management**: Tracks scores, turns, and game progress
- **Visual Feedback**: 
  - Hover effects on available cells
  - Animation when CPU is thinking
  - Visual indicator for winning combinations
  - Modal notifications for game results

## Technical Stack

- React 19
- TypeScript
- Tailwind CSS
- React Router for navigation
- Context API for state management

## Project Structure

```
src/
  ├── components/
  │   ├── Button.tsx
  │   ├── Game.tsx
  │   ├── Modal.tsx
  │   ├── OIcon.tsx
  │   ├── PickPlayer.tsx
  │   └── XIcon.tsx
  ├── context/
  │   └── appContext.tsx
  └── layout/
      └── AppLayout.tsx
```

## Game Rules

1. Players take turns placing their marks (X or O) in empty cells
2. First player to get 3 of their marks in a row (horizontally, vertically, or diagonally) wins
3. Game ends in a draw if all cells are filled with no winner

## Learning Objectives

This project demonstrates:
- React component architecture
- State management with Context API
- TypeScript type definitions
- CSS animations and transitions
- Responsive design principles
- Game logic implementation

## Future Improvements

- Add difficulty levels for CPU opponent
- Implement local storage for game statistics
- Add sound effects
- Enable two-player mode
- Add unit tests

## Development

To run the project locally:

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

## License

This project is created for practice purposes and is available under the MIT License.# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

