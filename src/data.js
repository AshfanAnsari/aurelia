import { img } from './lib';
import { CatRing, CatCouple, CatEarrings, CatNecklace, CatBracelet, CatBangles } from './components/icons';

/* Catalogue data — copied 1:1 from the original build (prices in INR). */

export const CATEGORIES = [
  { id: 'rings', label: 'Rings', count: '48 pieces', Icon: CatRing },
  { id: 'couple', label: 'Couple Rings', count: '26 pairs', Icon: CatCouple },
  { id: 'earrings', label: 'Earrings', count: '39 pieces', Icon: CatEarrings },
  { id: 'necklaces', label: 'Necklaces', count: '34 pieces', Icon: CatNecklace },
  { id: 'bracelets', label: 'Bracelets', count: '22 pieces', Icon: CatBracelet },
  { id: 'bangles', label: 'Bangles', count: '18 pieces', Icon: CatBangles },
];

export const METALS = [
  { id: 'yellow', name: '18k Yellow Gold', price: 184000 },
  { id: 'rose', name: '18k Rose Gold', price: 179000 },
  { id: 'titanium', name: 'Titanium', price: 96000 },
];

export const STONES = [
  { id: 'emerald', name: 'Emerald', price: 24000 },
  { id: 'sapphire', name: 'Sapphire', price: 19000 },
  { id: 'diamond', name: 'Diamond', price: 38000 },
];

export const CARATS = [
  { id: 'c050', label: '0.50 ct', add: -30000 },
  { id: 'c075', label: '0.75 ct', add: -15000 },
  { id: 'c100', label: '1.00 ct', add: 0 },
  { id: 'c125', label: '1.25 ct', add: 28000 },
];

/* Ring-film stills used as configurator view thumbnails (seek targets in seconds). */
export const VIEWS = [
  { t: 0.5, src: img('view-profile.jpg'), label: 'View — profile angle' },
  { t: 3.5, src: img('view-three-quarter.jpg'), label: 'View — three-quarter angle' },
  { t: 6.5, src: img('view-crown.jpg'), label: 'View — crown detail' },
];

export const DEALS = [
  { id: 'choker', title: 'Luxury Choker', price: 42500, rating: '4.9', cat: 'Necklaces', img: img('choker.jpg'), alt: 'Diamond choker necklace on a linen bust' },
  { id: 'ruby-cuff', title: 'Sculpted Ruby Ring', price: 56500, rating: '4.9', cat: 'Rings', img: img('ruby-ring.jpg'), alt: 'Sculpted rose gold ring set with a ruby' },
  { id: 'eternity-bands', title: 'Pavé Eternity Set', price: 93000, rating: '4.8', cat: 'Couple Rings', img: img('eternity-bands.jpg'), alt: 'Pair of pavé diamond eternity bands' },
];

export const POPULAR = [
  { id: 'pop-solitaire', title: 'Solitaire Ring', price: 170000, rating: '4.9', cat: 'Rings', bg: '#C7674F', text: '#FFFFFF', pill: 'rgba(255,255,255,.22)', buy: 'rgba(255,255,255,.28)', img: img('solitaire.jpg'), alt: 'Diamond solitaire ring on a terracotta ground' },
  { id: 'pop-tennis', title: 'Tennis Bracelet', price: 125000, rating: '4.8', cat: 'Bracelets', bg: '#1C2329', text: '#FFFFFF', pill: 'rgba(255,255,255,.14)', buy: 'rgba(255,255,255,.18)', img: img('tennis-bracelet.jpg'), alt: 'Diamond tennis bracelet on a black ground' },
  { id: 'pop-earrings', title: 'Drop Earrings', price: 103750, rating: '4.6', cat: 'Earrings', bg: '#B3B9CD', text: '#222426', pill: 'rgba(255,255,255,.38)', buy: 'rgba(255,255,255,.36)', img: img('drop-earrings.jpg'), alt: 'Emerald and diamond drop earrings on a lavender ground' },
];

export const SEARCH_ITEMS = DEALS.concat(POPULAR).concat([
  { id: 'cfg-solitaire', title: 'Configured Solitaire', price: 222000, cat: 'Configurator', img: img('view-three-quarter.jpg'), href: '#configurator' },
]);

export const CUSTOM_PRICE = 120500;
export const CUSTOM_METALS = ['Platinum', 'Rose Gold', 'Yellow Gold'];

export const DUST = [
  [12, 30, 0], [24, 62, 1.4], [38, 22, 2.6], [52, 70, 0.6], [63, 34, 3.4],
  [71, 58, 1.9], [82, 26, 2.2], [90, 66, 0.9], [45, 48, 4.1], [18, 78, 3.0],
];
