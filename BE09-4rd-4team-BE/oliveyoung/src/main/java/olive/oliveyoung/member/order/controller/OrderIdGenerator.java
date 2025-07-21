package olive.oliveyoung.member.order.controller;

import java.util.Random;

public class OrderIdGenerator {

    private static final String LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static String generate() {
        Random random = new Random();
        char letter = LETTERS.charAt(random.nextInt(LETTERS.length()));

        long timestampPart = System.currentTimeMillis();

        return letter + String.valueOf(timestampPart);
    }
}