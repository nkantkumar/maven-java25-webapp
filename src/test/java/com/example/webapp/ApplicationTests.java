package com.example.webapp;

import com.example.webapp.model.JvmInfo;
import com.example.webapp.service.Java25FeatureService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = {Application.class, Java25FeatureService.class})
class ApplicationTests {

    static {
        System.setProperty("spring.classformat.ignore", "true");
    }

    @Autowired
    private Java25FeatureService featureService;

    @Test
    void contextLoads() {
        assertNotNull(featureService);
    }

    @Test
    void testJvmDiagnosticsReturnsJava25() {
        JvmInfo jvmInfo = featureService.getJvmDiagnostics();
        assertNotNull(jvmInfo);
        assertNotNull(jvmInfo.javaVersion(), "Java version should not be null");
        assertFalse(jvmInfo.javaVersion().isBlank(), "Java version should not be blank");
        assertTrue(jvmInfo.isVirtualThreadSupportActive(), "Virtual Threads should be active");
    }

    @Test
    void testVirtualThreadsBenchmarkExecution() {
        Map<String, Object> benchmark = featureService.runVirtualThreadsBenchmark(100, 10);
        assertNotNull(benchmark);
        assertEquals(100, benchmark.get("taskCount"));
        assertTrue((Boolean) benchmark.get("isVirtualThreadsUsed"));
    }
}
