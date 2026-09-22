package com.example.webapp.controller;

import com.example.webapp.model.FeatureDemoResult;
import com.example.webapp.model.JvmInfo;
import com.example.webapp.service.Java25FeatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DashboardApiController {

    private final Java25FeatureService featureService;

    public DashboardApiController(Java25FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping("/jvm")
    public ResponseEntity<JvmInfo> getJvmInfo() {
        return ResponseEntity.ok(featureService.getJvmDiagnostics());
    }

    @GetMapping("/features")
    public ResponseEntity<List<FeatureDemoResult>> getFeatures() {
        return ResponseEntity.ok(featureService.getJava25FeatureDemos());
    }

    @PostMapping("/benchmark/virtual-threads")
    public ResponseEntity<Map<String, Object>> runBenchmark(
            @RequestParam(defaultValue = "1000") int taskCount,
            @RequestParam(defaultValue = "20") int delayMs) {
        int safeTaskCount = Math.min(Math.max(taskCount, 10), 50000);
        int safeDelayMs = Math.min(Math.max(delayMs, 1), 1000);

        Map<String, Object> result = featureService.runVirtualThreadsBenchmark(safeTaskCount, safeDelayMs);
        return ResponseEntity.ok(result);
    }
}
