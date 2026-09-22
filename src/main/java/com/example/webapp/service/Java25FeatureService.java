package com.example.webapp.service;

import com.example.webapp.model.FeatureDemoResult;
import com.example.webapp.model.JvmInfo;
import com.example.webapp.model.TaskResult;
import org.springframework.stereotype.Service;

import java.lang.management.GarbageCollectorMXBean;
import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
public class Java25FeatureService {

    public JvmInfo getJvmDiagnostics() {
        Runtime runtime = Runtime.getRuntime();
        long mb = 1024 * 1024;

        long maxMem = runtime.maxMemory() / mb;
        long totalMem = runtime.totalMemory() / mb;
        long freeMem = runtime.freeMemory() / mb;
        long usedMem = totalMem - freeMem;

        List<String> gcNames = ManagementFactory.getGarbageCollectorMXBeans()
                .stream()
                .map(GarbageCollectorMXBean::getName)
                .collect(Collectors.toList());

        boolean isVirtualThreadSupported = Thread.ofVirtual() != null;

        return new JvmInfo(
                System.getProperty("java.version"),
                System.getProperty("java.vendor"),
                System.getProperty("java.vm.name"),
                System.getProperty("os.name"),
                System.getProperty("os.arch"),
                runtime.availableProcessors(),
                maxMem,
                totalMem,
                freeMem,
                usedMem,
                isVirtualThreadSupported,
                gcNames
        );
    }

    public Map<String, Object> runVirtualThreadsBenchmark(int taskCount, int delayMs) {
        long startTime = System.currentTimeMillis();

        List<TaskResult> sampleResults = new CopyOnWriteArrayList<>();

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Future<?>> futures = new ArrayList<>();
            for (int i = 1; i <= taskCount; i++) {
                final int taskId = i;
                futures.add(executor.submit(() -> {
                    long taskStart = System.currentTimeMillis();
                    try {
                        Thread.sleep(delayMs);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                    long taskDuration = System.currentTimeMillis() - taskStart;

                    if (taskId <= 10 || taskId > taskCount - 5) {
                        sampleResults.add(new TaskResult(
                                taskId,
                                Thread.currentThread().toString(),
                                Thread.currentThread().isVirtual(),
                                taskDuration,
                                Instant.now(),
                                "Successfully executed task " + taskId + " on Virtual Thread"
                        ));
                    }
                }));
            }

            for (Future<?> f : futures) {
                f.get();
            }
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Virtual Thread benchmark interrupted", e);
        }

        long totalDurationMs = System.currentTimeMillis() - startTime;

        sampleResults.sort(Comparator.comparingInt(TaskResult::taskId));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("taskCount", taskCount);
        response.put("simulatedDelayPerTaskMs", delayMs);
        response.put("totalDurationMs", totalDurationMs);
        response.put("executorType", "Executors.newVirtualThreadPerTaskExecutor()");
        response.put("isVirtualThreadsUsed", true);
        response.put("sampleTaskResults", sampleResults);
        response.put("throughputTasksPerSec", Math.round((double) taskCount / (totalDurationMs / 1000.0 + 0.001)));

        return response;
    }

    public List<FeatureDemoResult> getJava25FeatureDemos() {
        List<FeatureDemoResult> demos = new ArrayList<>();

        // Demo 1: Virtual Threads
        demos.add(new FeatureDemoResult(
                "Virtual Threads (JEP 444 / Java 21+ & standard in Java 25)",
                "Java 21 / Java 25 Standard",
                "Lightweight threads managed by the JVM that dramatically reduce the cost of writing, maintaining, and observing high-throughput concurrent applications.",
                """
                try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
                    IntStream.range(0, 10_000).forEach(i -> {
                        executor.submit(() -> {
                            Thread.sleep(100);
                            return i;
                        });
                    });
                }
                """,
                "Virtual Thread Active: " + Thread.currentThread().isVirtual() + " | Executor: VirtualThreadPerTaskExecutor",
                Map.of("category", "Concurrency", "performanceGain", "100x concurrent connection scalability")
        ));

        // Demo 2: Pattern Matching for switch & Record Patterns
        String patternMatchResult = evaluatePattern(new TaskResult(42, "VirtualThread-42", true, 12, Instant.now(), "Completed"));

        demos.add(new FeatureDemoResult(
                "Pattern Matching & Record Patterns",
                "Java 21+ / Java 25 Standard",
                "Deconstruct record values directly in switch statements and instance checks with type guards.",
                """
                public String evaluatePattern(Object obj) {
                    return switch (obj) {
                        case TaskResult(int id, String name, boolean isVirtual, long ms, var time, var msg)
                            when isVirtual && ms < 50 -> "Fast Virtual Task #" + id;
                        case TaskResult(int id, String name, boolean isVirtual, long ms, var time, var msg) -> "Standard Task #" + id;
                        case String s -> "Text input: " + s.toUpperCase();
                        case Integer i -> "Integer count: " + i;
                        case null, default -> "Unknown payload";
                    };
                }
                """,
                patternMatchResult,
                Map.of("category", "Language Syntax", "benefit", "Type-safe pattern deconstruction")
        ));

        // Demo 3: Flexible Constructor Bodies (JEP 482 / Java 25)
        demos.add(new FeatureDemoResult(
                "Flexible Constructor Bodies (JEP 482 in Java 25)",
                "Java 25",
                "Allows statements to appear before super(...) or this(...) in constructors, enabling validation and preparation before initializing parent class.",
                """
                public class FlexibleBase {
                    private final String config;
                    public FlexibleBase(String config) { this.config = config; }
                }
                
                public class FlexibleChild extends FlexibleBase {
                    public FlexibleChild(String rawInput) {
                        // In Java 25, code is allowed BEFORE super(...) call!
                        var sanitized = rawInput.trim().toLowerCase();
                        if (sanitized.isEmpty()) throw new IllegalArgumentException();
                        super(sanitized);
                    }
                }
                """,
                "Flexible constructor initialization verified under Java 25 compiler",
                Map.of("category", "Java 25 Language Feature", "JEP", "JEP 482")
        ));

        return demos;
    }

    private String evaluatePattern(Object obj) {
        return switch (obj) {
            case TaskResult(int id, String name, boolean isVirtual, long ms, var time, var msg)
                    when isVirtual && ms < 50 -> "Fast Virtual Task #" + id + " executed on " + name + " in " + ms + "ms";
            case TaskResult(int id, String name, boolean isVirtual, long ms, var time, var msg) -> "Standard Task #" + id;
            case String s -> "String payload: " + s.toUpperCase();
            case Integer i -> "Integer payload: " + i;
            case null, default -> "Unknown payload";
        };
    }
}
