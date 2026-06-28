package com.verifime.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class MoneyUtils {

    private static final int RATE_SCALE = 4;
    private static final int MONEY_SCALE = 2;

    private MoneyUtils() {
    }

    public static BigDecimal roundRate(BigDecimal rate) {
        return rate.setScale(RATE_SCALE, RoundingMode.HALF_UP);
    }

    public static BigDecimal roundMoney(BigDecimal amount) {
        return amount.setScale(MONEY_SCALE, RoundingMode.HALF_UP);
    }

    public static BigDecimal unitRate() {
        return roundRate(BigDecimal.ONE);
    }
}
