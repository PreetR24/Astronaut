import java.util.Scanner;

// Product interface
interface Train {
    double getTicketPrice();
}

// Concrete Products
class RajdhaniTicket implements Train {
    private final double price = 1500;

    @Override
    public double getTicketPrice() {
        return price;
    }
}

class ExpressTicket implements Train {
    private final double price = 900;

    @Override
    public double getTicketPrice() {
        return price;
    }
}

class LocalTicket implements Train {
    private final double price = 300;

    @Override
    public double getTicketPrice() {
        return price;
    }
}

// Factory class
class TrainTicketFactory {
    public Train getTrainTicket(int choice) {
        switch (choice) {
            case 1:
                return new RajdhaniTicket();
            case 2:
                return new ExpressTicket();
            case 3:
                return new LocalTicket();
            default:
                return null;
        }
    }
}

// Client
public class FactoryPatternTrain {
    public static void main(String[] args) {
        System.out.println("Available Trains:");
        System.out.println("1) Rajdhani Train");
        System.out.println("2) Express Train");
        System.out.println("3) Local Train");
        System.out.print("Enter the choice (1-3): ");

        try (Scanner sc = new Scanner(System.in)) {
            int choice = sc.nextInt();

            TrainTicketFactory factory = new TrainTicketFactory();
            Train ticket = factory.getTrainTicket(choice);

            if (ticket != null) {
                System.out.println(ticket.getClass().getSimpleName()
                        + " ticket with price: " + ticket.getTicketPrice());
            } else {
                System.out.println("Invalid choice. Please select between 1 and 3.");
            }
        }
    }
}