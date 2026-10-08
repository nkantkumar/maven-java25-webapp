import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import JvmDiagnosticsCard from './components/JvmDiagnosticsCard';
import VirtualThreadsBenchmarkCard from './components/VirtualThreadsBenchmarkCard';
import Java25FeaturesCard from './components/Java25FeaturesCard';
import RxJsLiveStreamCard from './components/RxJsLiveStreamCard';
import Footer from './components/Footer';

import { setupJvmStream } from './rxjs/jvmStreamService';
import { setupFeaturesStream, loadFeaturesTrigger$ } from './rxjs/featuresStreamService';
import { setupBenchmarkStream } from './rxjs/benchmarkStreamService';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize RxJS Event Streams & Observables
    const jvmSub = setupJvmStream(dispatch);
    const featuresSub = setupFeaturesStream(dispatch);
    const benchmarkSub = setupBenchmarkStream(dispatch);

    // Trigger initial feature load via RxJS trigger
    loadFeaturesTrigger$.next();

    return () => {
      jvmSub.unsubscribe();
      featuresSub.unsubscribe();
      benchmarkSub.unsubscribe();
    };
  }, [dispatch]);

  return (
    <>
      <div className="app-background"></div>
      <div className="app-container">
        <Header />

        <main className="dashboard-grid">
          <JvmDiagnosticsCard />
          <VirtualThreadsBenchmarkCard />
          <Java25FeaturesCard />
          <RxJsLiveStreamCard />
        </main>

        <Footer />
      </div>
    </>
  );
}
