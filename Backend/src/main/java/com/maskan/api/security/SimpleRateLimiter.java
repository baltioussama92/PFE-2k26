package com.maskan.api.security;

import java.util.ArrayDeque;
import java.util.Deque;

public class SimpleRateLimiter {

    private final int limit;
    private final long windowMs;
    private final Deque<Long> timestamps = new ArrayDeque<>();

    public SimpleRateLimiter(int limit, long windowMs) {
        this.limit = limit;
        this.windowMs = windowMs;
    }

    public synchronized boolean tryAcquire() {
        long now = System.currentTimeMillis();
        while (!timestamps.isEmpty() && now - timestamps.peekFirst() > windowMs) {
            timestamps.removeFirst();
        }
        if (timestamps.size() >= limit) {
            return false;
        }
        timestamps.addLast(now);
        return true;
    }
}
