/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          electric: '#F7D02C',
          water: '#6390F0',
          grass: '#7AC74C',
          fire: '#EE8130',
          normal: '#A8A878',
          fighting: '#C22E1C',
          flying: '#A98FF3',
          poison: '#A33EA7',
          ground: '#E2BF65',
          rock: '#B6A136',
          bug: '#A6B91A',
          ghost: '#705898',
          steel: '#B7B7CE',
          psychic: '#F85888',
          ice: '#96D9D6',
          dragon: '#6F35FC',
          dark: '#705848',
          fairy: '#D685AD',
        },
      },
    },
  },
  plugins: [],
}