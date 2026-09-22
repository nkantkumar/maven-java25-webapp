package com.example.webapp.model;

import java.util.List;

public record JvmInfo(
        String javaVersion,
        String javaVendor,
        String javaVmName,
        String osName,
        String osArch,
        int availableProcessors,
        long maxMemoryMb,
        long totalMemoryMb,
        long freeMemoryMb,
        long usedMemoryMb,
        boolean isVirtualThreadSupportActive,
        List<String> activeGarbageCollectors
) {}
