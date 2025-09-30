// Target interface (what client expects)
interface Kitchen {
    void prepare(String item, String flavor);
}

// Adaptee interface (incompatible)
interface Food {
    void prepareBurger(String flavor);
    void preparePizza(String flavor);
}

// Concrete Adaptees
class Burger implements Food {
    @Override
    public void prepareBurger(String flavor) {
        System.out.println("Preparing Burger type: " + flavor);
    }

    @Override
    public void preparePizza(String flavor) {
        // Not applicable
    }
}

class Pizza implements Food {
    @Override
    public void prepareBurger(String flavor) {
        // Not applicable
    }

    @Override
    public void preparePizza(String flavor) {
        System.out.println("Preparing Pizza type: " + flavor);
    }
}

// Adapter class (makes Food compatible with Kitchen)
class FoodAdapter implements Kitchen {
    private Food food;

    public FoodAdapter(String type) {
        if (type.equalsIgnoreCase("burger")) {
            food = new Burger();
        } else if (type.equalsIgnoreCase("pizza")) {
            food = new Pizza();
        }
    }

    @Override
    public void prepare(String item, String flavor) {
        if (item.equalsIgnoreCase("burger")) {
            food.prepareBurger(flavor);
        } else if (item.equalsIgnoreCase("pizza")) {
            food.preparePizza(flavor);
        }
    }
}

// Concrete class (Client-facing) that uses Adapter when needed
class DrinkManufacturer implements Kitchen {
    @Override
    public void prepare(String item, String flavor) {
        if (item.equalsIgnoreCase("pepsi")) {
            System.out.println("Preparing Pepsi: " + flavor);
        } else if (item.equalsIgnoreCase("burger") || item.equalsIgnoreCase("pizza")) {
            Kitchen adapter = new FoodAdapter(item);
            adapter.prepare(item, flavor);
        } else {
            System.out.println("Invalid item: " + item);
        }
    }
}

// Client
public class AdapterFoodDemo {
    public static void main(String[] args) {
        Kitchen kitchen = new DrinkManufacturer();

        kitchen.prepare("pepsi", "Cold");
        kitchen.prepare("burger", "Peri Peri");
        kitchen.prepare("pizza", "Margherita");
        kitchen.prepare("pasta", "Macaroni");
    }
}