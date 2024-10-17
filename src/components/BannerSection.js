import React from 'react';

const BannerSection = () => {
  return (
    <section 
      className="w-full h-[150px] mb-20 rounded-2xl flex justify-center items-center gap-2.5 bg-cover bg-center" 
      style={{backgroundImage: "url('/registrateAhora.png')"}}
    >
      <div className="w-1/4 flex justify-center items-center">
        <button className="rounded-full bg-transparent text-white border-2 border-white text-xs px-2.5 py-1.5 font-bold">
          ES GRATIS
        </button>
      </div>
      <div className="w-[45%] flex flex-col ml-2.5">
        <h3 className="text-white text-base leading-[18px] m-0">¿QUIERES VENDER</h3>
        <h2 className="text-[#09fdfd] text-lg leading-5 m-0">ALGO</h2>
        <p className="text-white text-sm leading-4 m-0">Públicalo ahora</p>
      </div>
      <div className="w-1/5 flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 15 15" className="fill-white">
          <path d="M7.646 3.97a.75.75 0 0 0 0 1.06l1.72 1.72H3.75a.75.75 0 0 0 0 1.5h5.616l-1.72 1.72a.75.75 0 1 0 1.061 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 0ZM15 7.5a7.5 7.5 0 1 0-15 0 7.5 7.5 0 0 0 15 0Zm-7.5-6a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"/>
        </svg>
      </div>
    </section>
  );
};

export default BannerSection;