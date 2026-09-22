package com.example.webapp.model;

import java.time.Instant;

/**
 * Record representing Java 25 Virtual Thread Benchmark results.
 * Demonstrates compact constructors and immutable record semantics.
 */
public record TaskResult(
        int taskId,
        String threadName,
        boolean isVirtual,
        long executionTimeMs,
        Instant completedAt,
        String statusMessage
) {
    public TaskResult {
        if (taskId < 0) {
            throw new IllegalArgumentException("taskId cannot be negative");
        }
        if (completedAt == null) {
            completedAt = Instant.now();
        }
    }
}
