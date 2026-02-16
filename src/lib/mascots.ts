export interface Mascot {
  id: string;
  name: string;
  year: number;
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
];

export function getMascotById(id: string): Mascot | undefined {
  return MASCOTS.find((m) => m.id === id);
}
