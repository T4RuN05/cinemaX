import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="page-shell flex min-h-screen flex-col text-white">
      <Navbar />
      <main className="grow px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}