export default function AboutPage() {
  return (
    <div className="max-w-xl mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Tietoa sovelluksesta</h1>
      <p>Kodin ruokalista on helppokäyttöinen sovellus viikkoruokalistan ja ostoslistan suunnitteluun.</p>
      <ul className="list-disc ml-6 text-gray-700">
        <li>Suunnittele viikon tai kuukauden ateriat helposti.</li>
        <li>Valitse ja hallitse reseptejä omiin tarpeisiisi.</li>
        <li>Ostoslista muodostuu automaattisesti valituista resepteistä.</li>
        <li>Tuo ja vie reseptejä sekä viikkosuunnitelmia tiedostona.</li>
        <li>Valitse teema ja näkymä (viikko/kuukausi) asetuksista.</li>
      </ul>
      <p className="text-gray-500 text-sm">Sovellus toimii täysin selaimessa, eikä tallenna tietoja ulkopuolisille palvelimille.</p>
      <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Kodin ruokalista</p>
    </div>
  );
} 