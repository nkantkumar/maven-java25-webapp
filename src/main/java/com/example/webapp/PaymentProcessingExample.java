package com.example.webapp;

import io.reactivex.rxjava3.core.Single;
import io.reactivex.rxjava3.schedulers.Schedulers;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Example: processing a payment through several async steps
 * (validate -> fraud check -> charge -> record) using RxJava3.
 *
 * Demonstrates patterns that are actually useful in payments systems:
 *  - chaining dependent async calls (flatMap)
 *  - running independent calls in parallel and combining results (zip)
 *  - timeouts on network calls
 *  - retrying transient failures with backoff
 *  - graceful fallback / error recovery
 *  - running on a dedicated thread pool (IO scheduler)
 */
public class PaymentProcessingExample {

    // ---- Domain objects (simplified) ----
    record PaymentRequest(String customerId, String cardToken, long amountCents, String currency) {}
    record FraudCheckResult(boolean approved, String reason) {}
    record CurrencyRate(double rate) {}
    record ChargeResult(String transactionId, String status) {}

    // ---- Simulated async service calls ----
    // In a real system these would be Retrofit/WebClient calls wrapped in Single.fromCallable / Single.create

    Single<Boolean> validateRequest(PaymentRequest req) {
        return Single.fromCallable(() -> req.amountCents() > 0 && req.cardToken() != null)
                .subscribeOn(Schedulers.io());
    }

    Single<FraudCheckResult> runFraudCheck(PaymentRequest req) {
        return Single.fromCallable(() -> {
                    // pretend network call to a fraud-scoring service
                    Thread.sleep(50);
                    return new FraudCheckResult(true, "low_risk");
                })
                .timeout(500, TimeUnit.MILLISECONDS)
                .retry(2) // retry transient failures (timeouts, network blips)
                .subscribeOn(Schedulers.io());
    }

    Single<CurrencyRate> fetchExchangeRate(String currency) {
        return Single.fromCallable(() -> {
                    Thread.sleep(30);
                    return new CurrencyRate(1.0); // pretend lookup
                })
                .subscribeOn(Schedulers.io());
    }

    Single<ChargeResult> chargeCard(PaymentRequest req, double effectiveRate) {
        return Single.fromCallable(() -> {
                    Thread.sleep(80);
                    return new ChargeResult("txn_" + System.nanoTime(), "SUCCEEDED");
                })
                .timeout(2, TimeUnit.SECONDS)
                .retry(1)
                .subscribeOn(Schedulers.io());
    }

    Single<Void> recordTransaction(ChargeResult result) {
        return Single.fromCallable(() -> {
                    // write to ledger/db
                    System.out.println("Recorded: " + result.transactionId() + " " + result.status());
                    return (Void) null;
                })
                .subscribeOn(Schedulers.io());
    }

    // ---- The actual pipeline ----

    Single<ChargeResult> processPayment(PaymentRequest req) {
        return validateRequest(req)
                .flatMap(valid -> {
                    if (!valid) {
                        return Single.error(new IllegalArgumentException("Invalid payment request"));
                    }
                    // fraud check and exchange-rate lookup are independent -> run in parallel, then combine
                    return Single.zip(
                            runFraudCheck(req),
                            fetchExchangeRate(req.currency()),
                            (fraud, rate) -> {
                                if (!fraud.approved()) {
                                    throw new SecurityException("Fraud check failed: " + fraud.reason());
                                }
                                return rate.rate();
                            }
                    );
                })
                .flatMap(effectiveRate -> chargeCard(req, effectiveRate))
                .flatMap(chargeResult -> recordTransaction(chargeResult)
                        .map(ignored -> chargeResult))
                // fallback: if the charge ultimately fails after retries, return a declined result
                // instead of propagating the raw exception up to the caller
                .onErrorReturn(err -> new ChargeResult("none", "DECLINED: " + err.getMessage()));
    }

    public static void main(String[] args) throws InterruptedException {
        PaymentProcessingExample service = new PaymentProcessingExample();

        PaymentRequest request = new PaymentRequest("cust_123", "tok_abc", 4999, "USD");

        service.processPayment(request)
                .subscribe(
                        result -> System.out.println("Final result: " + result),
                        error -> System.err.println("Unexpected error: " + error)
                );

        // keep JVM alive long enough to see the async result (demo only)
        Thread.sleep(1000);
    }
}
