export type SongKeys = {
  // every key has the same type as the 'id' field of SongKeyEntry
  [key: string]: SongKeyEntry;
};

export type SongKeyEntry = {
  id: string;
  name: string;
  key: CamelotKey;
};

enum CamelotKey {
  a1 = '1A',
  a2 = '2A',
  a3 = '3A',
  a4 = '4A',
  a5 = '5A',
  a6 = '6A',
  a7 = '7A',
  a8 = '8A',
  a9 = '9A',
  a10 = '10A',
  a11 = '11A',
  a12 = '12A',
  b1 = '1B',
  b2 = '2B',
  b3 = '3B',
  b4 = '4B',
  b5 = '5B',
  b6 = '6B',
  b7 = '7B',
  b8 = '8B',
  b9 = '9B',
  b10 = '10B',
  b11 = '11B',
  b12 = '12B',
}
