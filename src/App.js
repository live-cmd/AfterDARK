import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import Performers from './pages/Performers';
import Tickets from './pages/Tickets';
import PrivateEvents from './pages/PrivateEvents';
import Radar from './pages/Radar';
import About from './pages/About';
import Submit from './pages/Submit';
import './styles/global.css';

function Layout({ children }) {
  return (
    <>
      <Nav />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/performers" element={<Layout><Performers /></Layout>} />
        <Route path="/tickets" element={<Layout><Tickets /></Layout>} />
        <Route path="/private-events" element={<Layout><PrivateEvents /></Layout>} />
        <Route path="/radar" element={<Layout><Radar /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/submit" element={<Layout><Submit /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
