package app.cinemax;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class CinemaxApplication {

	public static void main(String[] args) {
		SpringApplication.run(CinemaxApplication.class, args);
	}

}
