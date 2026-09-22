package com.example.webapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println(" Starting Java 25 Maven Sample Web Application ");
        System.out.println(" Java Version : " + System.getProperty("java.version"));
        System.out.println(" Java Runtime : " + System.getProperty("java.runtime.name"));
        System.out.println(" Maven Project: maven-java25-webapp ");
        System.out.println("=================================================");
        SpringApplication.run(Application.class, args);
    }
}
