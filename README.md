# Educational Initiatives

This repository contains a collection of educational exercises and projects focused on software development best practices, design patterns, and practical application development.

## Project Structure

- **Exercise 1 (Design Pattern)**: A collection of design pattern implementations categorized by type:
  - Behavioral DP: Includes examples of behavioral design patterns such as Observer and Strategy.
  - Creational DP: Includes examples of creational design patterns such as Factory and Singleton.
  - Structural DP: Includes examples of structural design patterns such as Adapter and Decorator.

- **Exercise-2**: Contains the Astronaut Daily Schedule Organizer project.

## Exercise 2: Astronaut Daily Schedule Organizer

A console-based TypeScript application to manage an astronaut's daily tasks. It demonstrates clean architecture, automated testing, and three key design patterns: Singleton, Factory, and Observer.

### Features
- Interactive CLI for task management
- Task validation (time formats, overlaps)
- Persistent storage to JSON file
- Comprehensive test suite with Jest
- Logging with Winston

### Live Demo
You can explore the deployed project here:  
👉 [Astronaut Daily Schedule Organizer](https://astronaut-r2lg.onrender.com/)

### Quick Start
Requirements: Node.js 18+ and npm

1. Navigate to the project directory:
   ```bash
   cd Exercise-2/astronaut-schedule
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run the interactive CLI:
   ```bash
   npm run start
   ```

### Commands
- `add "description" HH:mm HH:mm [High|Medium|Low]` - Add a new task
- `remove <id|description>` - Remove a task
- `view [--priority High|Medium|Low]` - View tasks
- `edit <id> [--desc "..."] [--start HH:mm] [--end HH:mm] [--priority High]` - Edit a task
- `complete <id|description>` - Mark task as complete
- `help` - Show help
- `exit` - Exit the application
- `clear` - Clears the console display

### Architecture & Patterns
- **Singleton**: `ScheduleManager` - Central in-memory store with persistence.
- **Factory**: `TaskFactory` - Creates validated Task objects.
- **Observer**: Notifier interface with ConsoleNotifier - Publishes schedule events.

### Persistence
Tasks are saved to `./data/tasks.json` with retry/backoff for durability.

## Contributing
Feel free to explore the exercises, run the applications, and modify the code to learn more about design patterns and software architecture.