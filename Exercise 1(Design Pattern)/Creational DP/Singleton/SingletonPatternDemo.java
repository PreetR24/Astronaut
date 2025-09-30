// Singleton class
class Logger {
    // Step 1: Create a private static instance
    private static Logger instance;

    // Step 2: Make constructor private so no other class can instantiate
    private Logger() {
        System.out.println("Logger initialized...");
    }

    // Step 3: Provide a public method to return the single instance
    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }

    // Sample method
    public void log(String message) {
        System.out.println("[LOG]: " + message);
    }
}

// Client
public class SingletonPatternDemo {
    public static void main(String[] args) {
        // Both calls return the same instance
        Logger logger1 = Logger.getInstance();
        Logger logger2 = Logger.getInstance();

        logger1.log("First log message");
        logger2.log("Second log message");

        // Checking whether both references are same
        if (logger1 == logger2) {
            System.out.println("Both logger1 and logger2 point to the same instance!");
        }
    }
}