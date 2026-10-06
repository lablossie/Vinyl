// Voorbeelddata om de app meteen te kunnen bekijken. Via "Terug naar voorbeeldcollectie"
// (zie instellingen in de README) kan dit altijd gereset worden.
// Voor Amble en Kingfishr is bewust geen specifieke albumtitel verzonnen (daar was ik niet
// zeker van) -- die staan als plaatshouder, zodat je ze zelf met je eigen platen kan vervangen.

const SEED_RECORDS = [
  { id: 'seed_1', artist: 'Mumford & Sons', title: 'Sigh No More', year: 2009, genre: 'Folk rock', format: 'LP', condition: 'NM', label: 'Island Records', value: 28, favorite: true, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-01T10:00:00.000Z' },
  { id: 'seed_2', artist: 'Mumford & Sons', title: 'Babel', year: 2012, genre: 'Folk rock', format: 'LP', condition: 'VG+', label: 'Island Records', value: 24, favorite: false, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-02T10:00:00.000Z' },
  { id: 'seed_3', artist: 'Mumford & Sons', title: 'Wilder Mind', year: 2015, genre: 'Rock', format: 'LP', condition: 'VG', label: 'Island Records', value: 20, favorite: false, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-03T10:00:00.000Z' },
  { id: 'seed_4', artist: 'Mumford & Sons', title: 'Delta', year: 2018, genre: 'Folk rock', format: 'LP', condition: 'EX', label: 'Island Records/Glassnote', value: 22, favorite: false, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-04T10:00:00.000Z' },

  { id: 'seed_5', artist: 'Amble', title: 'Titel onbekend — vul aan', year: null, genre: 'Folk', format: 'LP', condition: 'NM', label: '', value: null, favorite: false, wishlist: false, notes: 'Plaatshouder: vervang dit door je eigen Amble-plaat.', description: '', cover: null, addedAt: '2026-01-05T10:00:00.000Z' },
  { id: 'seed_6', artist: 'Amble', title: 'Titel onbekend — vul aan', year: null, genre: 'Folk', format: 'LP', condition: 'VG+', label: '', value: null, favorite: false, wishlist: false, notes: 'Plaatshouder: vervang dit door je eigen Amble-plaat.', description: '', cover: null, addedAt: '2026-01-06T10:00:00.000Z' },

  { id: 'seed_7', artist: 'Kingfishr', title: 'Titel onbekend — vul aan', year: null, genre: 'Folk rock', format: 'LP', condition: 'NM', label: '', value: null, favorite: false, wishlist: false, notes: 'Plaatshouder: vervang dit door je eigen Kingfishr-plaat.', description: '', cover: null, addedAt: '2026-01-07T10:00:00.000Z' },

  { id: 'seed_8', artist: 'The Lumineers', title: 'The Lumineers', year: 2012, genre: 'Folk rock', format: 'LP', condition: 'VG+', label: 'Dualtone', value: 26, favorite: false, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-08T10:00:00.000Z' },
  { id: 'seed_9', artist: 'The Lumineers', title: 'Cleopatra', year: 2016, genre: 'Folk rock', format: 'LP', condition: 'NM', label: 'Dualtone', value: 24, favorite: true, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-09T10:00:00.000Z' },
  { id: 'seed_10', artist: 'The Lumineers', title: 'III', year: 2019, genre: 'Folk rock', format: 'LP', condition: 'VG', label: 'Dualtone', value: 22, favorite: false, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-10T10:00:00.000Z' },

  { id: 'seed_11', artist: 'Hozier', title: 'Hozier', year: 2014, genre: 'Blues rock', format: 'LP', condition: 'NM', label: 'Island Records', value: 25, favorite: true, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-11T10:00:00.000Z' },
  { id: 'seed_12', artist: 'Hozier', title: 'Wasteland, Baby!', year: 2019, genre: 'Alternative', format: 'LP', condition: 'VG+', label: 'Island Records', value: 23, favorite: false, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-12T10:00:00.000Z' },

  { id: 'seed_13', artist: 'Noah Kahan', title: 'Stick Season', year: 2022, genre: 'Folk pop', format: 'LP', condition: 'NM', label: 'Mercury/Republic', value: 27, favorite: false, wishlist: false, notes: '', description: '', cover: null, addedAt: '2026-01-13T10:00:00.000Z' },

  { id: 'seed_14', artist: 'Fleet Foxes', title: 'Helplessness Blues', year: 2011, genre: 'Folk', format: 'LP', condition: null, label: '', value: null, favorite: false, wishlist: true, notes: 'Op zoek naar een mooi gepreste herpersing.', description: '', cover: null, addedAt: '2026-01-14T10:00:00.000Z' }
];

// Werkt zowel in de browser (window.SEED_RECORDS) als in Node/Vercel API-functies
// (module.exports), zodat dezelfde voorbeelddata op twee plekken gebruikt kan worden.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEED_RECORDS;
} else if (typeof window !== 'undefined') {
  window.SEED_RECORDS = SEED_RECORDS;
}
