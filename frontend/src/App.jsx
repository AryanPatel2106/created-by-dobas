import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { CheckoutProvider } from './context/CheckoutContext';

function App() {
  return (
    <div className="flex flex-col min-h-screen font-inter">
      <CheckoutProvider>
        <Header />
        <main className="py-8 flex-grow">
          <div className="container mx-auto px-4">
            <Outlet />
          </div>
        </main>
        <Footer />
      </CheckoutProvider>
    </div>
  );
}

export default App;