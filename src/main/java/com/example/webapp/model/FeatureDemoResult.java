package com.example.webapp.model;

import java.util.Map;

public record FeatureDemoResult(
        String featureName,
        String javaVersionIntroducedOrStandard,
        String description,
        String codeSnippet,
        Object evaluationResult,
        Map<String, Object> metadata
) {}
