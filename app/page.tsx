import NumberSplittingGame from './components/NumberSplittingGame';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <NumberSplittingGame />
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 text-center text-gray-600 text-sm">
        <p>Gemaakt voor Mona & Otis ❤️</p>
      </footer>
    </main>
  );
}