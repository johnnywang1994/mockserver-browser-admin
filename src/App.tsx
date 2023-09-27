import MockPanel from '@/containers/MockPanel';
import Header from '@/components/Header';

function App() {
  return (
    <div className="flex flex-col h-screen bg-[#2e3235]">
      <Header />
      <MockPanel />
    </div>
  );
}

export default App
