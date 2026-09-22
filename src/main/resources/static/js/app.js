document.addEventListener('DOMContentLoaded', () => {
    // API Endpoints
    const API_JVM = '/api/jvm';
    const API_FEATURES = '/api/features';
    const API_BENCHMARK = '/api/benchmark/virtual-threads';

    // DOM Elements
    const jvmVersionEl = document.getElementById('jvmVersion');
    const jvmArchEl = document.getElementById('jvmArch');
    const jvmProcessorsEl = document.getElementById('jvmProcessors');
    const jvmVirtualSupportEl = document.getElementById('jvmVirtualSupport');
    const memoryTextEl = document.getElementById('memoryText');
    const memoryFillEl = document.getElementById('memoryFill');
    const gcContainerEl = document.getElementById('gcContainer');
    const badgeRuntimeEl = document.getElementById('badgeRuntime');

    const btnRefreshJvm = document.getElementById('btnRefreshJvm');
    const benchmarkForm = document.getElementById('benchmarkForm');
    const btnRunBenchmark = document.getElementById('btnRunBenchmark');
    const benchmarkResults = document.getElementById('benchmarkResults');
    const resDuration = document.getElementById('resDuration');
    const resThroughput = document.getElementById('resThroughput');
    const terminalContent = document.getElementById('terminalContent');

    const featuresTabsEl = document.getElementById('featuresTabs');
    const featureDisplayEl = document.getElementById('featureDisplay');

    let featuresData = [];

    // Fetch JVM Info
    async function loadJvmInfo() {
        try {
            const res = await fetch(API_JVM);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();

            jvmVersionEl.textContent = data.javaVersion;
            jvmArchEl.textContent = `${data.osArch} (${data.osName})`;
            jvmProcessorsEl.textContent = `${data.availableProcessors} Cores`;
            jvmVirtualSupportEl.textContent = data.isVirtualThreadSupportActive ? 'Enabled (Active)' : 'Disabled';
            badgeRuntimeEl.textContent = `${data.javaVendor} ${data.javaVersion}`;

            // Memory percentage
            const used = data.usedMemoryMb;
            const total = data.totalMemoryMb;
            const pct = Math.round((used / total) * 100);
            memoryTextEl.textContent = `${used} MB / ${total} MB (${pct}%)`;
            memoryFillEl.style.width = `${pct}%`;

            // GC Beans
            if (data.activeGarbageCollectors && data.activeGarbageCollectors.length > 0) {
                gcContainerEl.innerHTML = `
                    <span class="tag-label">Active GC:</span>
                    ${data.activeGarbageCollectors.map(gc => `<span class="gc-badge">${gc}</span>`).join('')}
                `;
            }
        } catch (err) {
            console.error('Failed to load JVM Info:', err);
        }
    }

    // Fetch Java 25 Feature Demos
    async function loadFeatures() {
        try {
            const res = await fetch(API_FEATURES);
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            featuresData = await res.json();

            renderFeaturesTabs();
            if (featuresData.length > 0) {
                renderFeatureDetail(0);
            }
        } catch (err) {
            console.error('Failed to load features:', err);
        }
    }

    function renderFeaturesTabs() {
        featuresTabsEl.innerHTML = featuresData.map((f, idx) => `
            <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                ${f.featureName.split('(')[0]}
            </button>
        `).join('');

        featuresTabsEl.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                featuresTabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                renderFeatureDetail(idx);
            });
        });
    }

    function renderFeatureDetail(idx) {
        const feature = featuresData[idx];
        if (!feature) return;

        featureDisplayEl.innerHTML = `
            <div class="feature-card-content">
                <div class="feature-info">
                    <h3>${feature.featureName}</h3>
                    <span class="jep-badge">${feature.javaVersionIntroducedOrStandard}</span>
                    <p>${feature.description}</p>
                    <div class="evaluation-box">
                        <div class="eval-title">Live Java 25 Evaluation Result:</div>
                        <div class="eval-val">${feature.evaluationResult}</div>
                    </div>
                </div>
                <div class="feature-code">
                    <pre><code>${escapeHtml(feature.codeSnippet)}</code></pre>
                </div>
            </div>
        `;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;");
    }

    // Handle Virtual Thread Benchmark Execution
    benchmarkForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskCount = parseInt(document.getElementById('taskCount').value, 10);
        const delayMs = parseInt(document.getElementById('delayMs').value, 10);

        btnRunBenchmark.disabled = true;
        btnRunBenchmark.innerHTML = `<span>Running Virtual Threads...</span>`;

        try {
            const res = await fetch(`${API_BENCHMARK}?taskCount=${taskCount}&delayMs=${delayMs}`, {
                method: 'POST'
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();

            // Display Results
            benchmarkResults.classList.remove('hidden');
            resDuration.textContent = `${data.totalDurationMs} ms`;
            resThroughput.textContent = `${data.throughputTasksPerSec.toLocaleString()} / sec`;

            // Terminal output formatting
            let logText = `// Benchmark Execution Summary:\n`;
            logText += `// Created ${data.taskCount} Virtual Threads using ${data.executorType}\n`;
            logText += `// Total Time: ${data.totalDurationMs} ms | Simulated Delay: ${data.simulatedDelayPerTaskMs} ms per task\n\n`;

            if (data.sampleTaskResults && data.sampleTaskResults.length > 0) {
                logText += `[Sample Task Output Traces]:\n`;
                data.sampleTaskResults.forEach(t => {
                    logText += `Task #${t.taskId} | Thread: ${t.threadName} | Virtual=${t.isVirtual} | Time=${t.executionTimeMs}ms\n`;
                });
            }

            terminalContent.textContent = logText;
        } catch (err) {
            console.error('Benchmark execution error:', err);
            terminalContent.textContent = `Error executing benchmark: ${err.message}`;
        } finally {
            btnRunBenchmark.disabled = false;
            btnRunBenchmark.innerHTML = `<span>Execute Benchmark</span>`;
            loadJvmInfo(); // Refresh memory/stats after benchmark
        }
    });

    btnRefreshJvm.addEventListener('click', loadJvmInfo);

    // Initial Load
    loadJvmInfo();
    loadFeatures();
});
