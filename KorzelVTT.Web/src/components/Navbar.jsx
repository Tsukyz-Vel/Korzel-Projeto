import mosasaurusSkull from '../assets/mosasaurus-skull.png';

export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="bg-[#140c08] border-b-2 border-[#3e2723] px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.8)] sticky top-0 z-[100] shrink-0">
      <div 
        className="text-amber-600 font-black text-2xl tracking-widest uppercase flex items-center gap-2 drop-shadow-md shrink-0 cursor-pointer" 
        onClick={() => setCurrentPage('início')}
      >
        <img src={mosasaurusSkull} alt="Logo" className="w-8 h-8 object-contain filter invert opacity-80" />
        KORZEL VTT
      </div>
      <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-2 sm:gap-x-6 w-full items-center">
        {['Início', 'Compêndio'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setCurrentPage(tab.toLowerCase())} 
            className={`pb-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors whitespace-nowrap border-b-2 ${currentPage === tab.toLowerCase() ? 'text-white border-red-800' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
}