import { Sidebar } from '@/components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-auto h-full relative">
        {children}
      </main>
    </div>
  );
}