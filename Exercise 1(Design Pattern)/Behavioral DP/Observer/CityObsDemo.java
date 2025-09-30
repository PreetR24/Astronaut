import java.util.ArrayList;
import java.util.List;

// Observer interface
interface CityObserver {
    void update(String cityName, float temperature);
}

// Subject class (Observable)
class CityWeather {
    private final List<CityObserver> observers = new ArrayList<>();
    private final String cityName;
    private float temperature;

    public CityWeather(String cityName) {
        this.cityName = cityName;
    }

    public void registerObserver(CityObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(CityObserver observer) {
        observers.remove(observer);
    }

    private void notifyObservers() {
        for (CityObserver observer : observers) {
            observer.update(cityName, temperature);
        }
    }

    public void setTemperature(float temperature) {
        this.temperature = temperature;
        notifyObservers();
    }
}

// Concrete Observer
class WeatherStation implements CityObserver {
    private final String stationName;

    public WeatherStation(String stationName) {
        this.stationName = stationName;
    }

    @Override
    public void update(String cityName, float temperature) {
        System.out.println(stationName + " reported: City " 
                + cityName + "'s temperature is " + temperature + "°C");
    }
}

// Driver
public class CityObsDemo {
    public static void main(String[] args) {
        CityWeather mumbai = new CityWeather("Mumbai");
        CityWeather delhi = new CityWeather("Delhi");

        WeatherStation station1 = new WeatherStation("Station 1");
        WeatherStation station2 = new WeatherStation("Station 2");

        mumbai.registerObserver(station1);
        mumbai.registerObserver(station2);
        delhi.registerObserver(station1);

        mumbai.setTemperature(24.0f);
        delhi.setTemperature(30.0f);
    }
}