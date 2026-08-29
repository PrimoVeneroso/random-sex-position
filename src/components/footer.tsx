export function Footer() {
  return (
    <footer className="w-full text-xs text-slate-400 mb-4 flex items-center justify-center flex-col gap-1 mb-5 animate__animated animate__fadeIn animate__delay-2s">
      <span className="text-center">
        Original project by Raminr77. Modified by you. 100% Offline.
      </span>
      <span className="text-center mt-2">
        <button onClick={() => {
          navigator.clipboard.writeText(localStorage.getItem('CUSTOM_TAGS') || '{}');
          alert('Custom tags copied to clipboard!');
        }} className="underline">
          Export Custom Tags JSON
        </button>
      </span>
    </footer>
  );
}
