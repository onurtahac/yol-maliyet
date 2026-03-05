import { useCallback, useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/hero/HeroSection';
import RouteForm from './components/calculator/RouteForm';
import ResultsPanel from './components/results/ResultsPanel';
import MapComponent from './components/results/MapComponent';
import { useCalculate } from './hooks/useCalculate';
import './styles/index.css';

export default function App() {
  const { data, loading, error, calculate } = useCalculate();
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  const handleSubmit = useCallback((formData) => {
    calculate(formData);
    setActiveRouteIndex(0);
  }, [calculate]);

  const handleRouteChange = useCallback((index) => {
    setActiveRouteIndex(index);
  }, []);

  return (
    <div className="app-shell">
      <Header />

      <main className="main-dashboard">
        <aside className="dashboard-sidebar">
          <div className="sidebar-content">
            {!data && !loading && <HeroSection />}

            <RouteForm onSubmit={handleSubmit} loading={loading} />

            <ResultsPanel
              data={data}
              loading={loading}
              error={error}
              activeRouteIndex={activeRouteIndex}
              onRouteChange={handleRouteChange}
            />

            <Footer className="desktop-footer" />
          </div>
        </aside>

        <section className="dashboard-map-area">
          <MapComponent
            routes={data?.routes || []}
            activeRouteIndex={activeRouteIndex}
          />
        </section>
      </main>
      <Footer className="mobile-footer" />
    </div>
  );
}
