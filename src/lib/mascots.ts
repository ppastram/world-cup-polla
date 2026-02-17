export interface Mascot {
  id: string;
  name: string;
  year?: number;
  country: string;
  imageUrl: string;
}

export const MASCOTS: Mascot[] = [
  { id: 'willie', name: 'Willie', year: 1966, country: 'Inglaterra', imageUrl: '/willie.jpeg' },
  { id: 'juanito', name: 'Juanito', year: 1970, country: 'Mexico', imageUrl: '/juanito.jpeg' },
  { id: 'tip-tap', name: 'Tip & Tap', year: 1974, country: 'Alemania', imageUrl: '/tip&tap.jpeg' },
  { id: 'gauchito', name: 'Gauchito', year: 1978, country: 'Argentina', imageUrl: '/gauchito.jpeg' },
  { id: 'naranjito', name: 'Naranjito', year: 1982, country: 'España', imageUrl: '/naranjito.jpeg' },
  { id: 'pique', name: 'Pique', year: 1986, country: 'Mexico', imageUrl: '/pique.jpeg' },
  { id: 'ciao', name: 'Ciao', year: 1990, country: 'Italia', imageUrl: '/ciao.jpeg' },
  { id: 'striker', name: 'Striker', year: 1994, country: 'USA', imageUrl: '/striker.jpeg' },
  { id: 'footix', name: 'Footix', year: 1998, country: 'Francia', imageUrl: '/footix.jpeg' },
  { id: 'nik-ato-kaz', name: 'Nik, Ato & Kaz', year: 2002, country: 'Corea/Japon', imageUrl: '/nik,ato&kaz.jpeg' },
  { id: 'goleo', name: 'Goleo VI', year: 2006, country: 'Alemania', imageUrl: '/goleo.jpeg' },
  { id: 'zakumi', name: 'Zakumi', year: 2010, country: 'Sudafrica', imageUrl: '/zakumi.jpeg' },
  { id: 'fuleco', name: 'Fuleco', year: 2014, country: 'Brasil', imageUrl: '/fuleco.jpeg' },
  { id: 'zabivaka', name: 'Zabivaka', year: 2018, country: 'Rusia', imageUrl: '/zabivaka.jpeg' },
  { id: 'laeeb', name: "La'eeb", year: 2022, country: 'Qatar', imageUrl: "/la'eeb.jpeg" },
  { id: 'maple-zayu-clutch', name: 'Maple, Zayu & Clutch', year: 2026, country: 'USA/Mexico/Canada', imageUrl: '/maple,zayu&clutch.jpeg' },

  { id: 'pele', name: 'Pelé', country: 'Brasil', imageUrl: '/pele.jpeg' },
  { id: 'maradona', name: 'Maradona', country: 'Argentina', imageUrl: '/maradona.jpeg' },
  { id: 'ronaldo', name: 'Ronaldo', country: 'Brasil', imageUrl: '/ronaldo.jpeg' },
  { id: 'ronaldinho', name: 'Ronaldinho', country: 'Brasil', imageUrl: '/ronaldinho.jpeg' },
  { id: 'kempes', name: 'Kempes', country: 'Argentina', imageUrl: '/kempes.jpeg' },
  { id: 'batistuta', name: 'Batistuta', country: 'Argentina', imageUrl: '/batistuta.jpeg' },
  { id: 'cubillas', name: 'Cubillas', country: 'Perú', imageUrl: '/cubillas.jpeg' },
  { id: 'keylor', name: 'Keylor', country: 'Costa Rica', imageUrl: '/keylor.jpeg' },
  { id: 'forlan', name: 'Forlán', country: 'Uruguay', imageUrl: '/forlan.jpeg' },
  { id: 'marquez', name: 'Rafa M', country: 'México', imageUrl: '/marquez.jpeg' },
  { id: 'pibe', name: 'El Pibe', country: 'Colombia', imageUrl: '/pibe.jpeg' },
  { id: 'higuita', name: 'Higuita', country: 'Colombia', imageUrl: '/higuita.jpeg' },
  { id: 'tino', name: 'Tino', country: 'Colombia', imageUrl: '/tino.jpeg' },

  { id: 'bilardo', name: 'Bilardo', country: 'Argentina', imageUrl: '/bilardo.jpeg' },
  { id: 'pekerman', name: 'Pekerman', country: 'Argentina', imageUrl: '/pekerman.jpeg' },
  { id: 'maturana', name: 'Maturana', country: 'Colombia', imageUrl: '/maturana.jpeg' },
];

export function getMascotById(id: string): Mascot | undefined {
  return MASCOTS.find((m) => m.id === id);
}
