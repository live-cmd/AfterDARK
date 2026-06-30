import { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import './Menu.css';

const SQUARE_ORDER_URL = 'https://cool-js-premium-water-ice.square.site/?location=11eadc1e968617a39beeac1f6bbba82c';

const FOOD = [
  {
    category: 'Platters',
    items: [
      { name: 'Chicken Tenderloin Platter', price: '$12.25', desc: 'Our juicy chicken tenders with your choice of fries, onion rings, or mac & cheese ball.' },
      { name: 'Louisiana Fried Whiting Platter', price: '$12.25', desc: 'Our deliciously seasoned fish with your choice of fries, onion rings, or mac & cheese ball.' },
      { name: 'Fried Shrimp Platter', price: '$13.25', desc: 'Our deliciously seasoned shrimp with your choice of fries, onion rings, or mac & cheese ball.' },
    ],
  },
  {
    category: 'Sandwiches',
    items: [
      { name: 'Hot Sausage', price: '$5.25', desc: 'Not quite hot, but more kick than mild — our 100% beef sausages are a crowd favorite.' },
      { name: 'Louisiana Fried Whiting Sandwich', price: '$9.75', desc: 'Lightly breaded with a mix of spices and a hint of lemon, deep fried to crispy, flaky perfection.' },
      { name: 'Hot Dog', price: '$4.25', desc: "Nathan's Famous 100% all-beef franks." },
    ],
  },
  {
    category: 'Bites',
    items: [
      { name: 'Chicken Tenderloins', price: '$8.25', desc: 'The most tender cut of chicken breast, battered and fried golden brown and juicy.' },
      { name: 'Louisiana Fried Whiting', price: '$8.25', desc: 'Whiting fillets seasoned with Louisiana spices, coated in a crispy breading, and fried to golden perfection with a perfect hint of lemon.' },
      { name: 'Fried Jumbo Shrimp', price: '$9.25', desc: 'A half dozen jumbo shrimp coated in a crispy, golden batter and fried to perfection — plump and juicy every time.' },
    ],
  },
  {
    category: 'Tacos',
    items: [
      { name: 'Shrimp Tacos', price: '$10.50', desc: 'Succulent shrimp topped with a creamy avocado cilantro sauce and a zesty spicy salsa, all wrapped in a soft flour tortilla.' },
      { name: 'Fish Tacos', price: '$9.75', desc: 'Crispy fish fillets topped with a refreshing cabbage slaw and drizzled with a creamy avocado sauce, all wrapped in warm, soft tortillas.' },
      { name: 'Crispy Chicken Tacos', price: '$9.50', desc: 'Crispy chicken with all the fixings, wrapped in a soft flour tortilla.' },
    ],
  },
  {
    category: 'Sides',
    items: [
      { name: 'Fried Mac & Cheese', price: '$6.50', desc: 'Homemade mac & cheese rolled into a ball and coated with seasoned bread crumbs, then deep fried — crispy on the outside, gooey and cheesy on the inside.' },
      { name: 'Fries', price: '$4.50', desc: 'Hot and fresh, made when you order and seasoned with our own savory blend of spices.' },
      { name: 'Onion Rings', price: '$4.50', desc: 'Golden crispy rings.' },
    ],
  },
];

const DRINKS = [
  {
    category: 'Signature Cocktails',
    note: "Our cocktails are built on Cool J's Premium Water Ice — every pour is one of a kind.",
    items: [
      { name: 'Back to Cali', price: '$13.95', desc: 'Cachaça — a Brazilian spirit with complex layers of citrus, vanilla, pepper, and subtle oak — poured over our sugar-free lemon ice.' },
      { name: 'Doin It', price: '$13.95', desc: "Premium vodka's slightly sweet corn and cracked pepper taste intermingled with our creamy sweet mango ice for a mellow finish." },
      { name: 'Headsprung', price: '$14.95', desc: "The sweet, tangy, crisp taste of our blue raspberry ice, infused with cognac's deep oak, tender fruit, vanilla, and spice flavors." },
      { name: 'Hey Lover', price: '$13.95', desc: 'Top shelf gin with a serious juniper-backed astringency, tamed by a shot of peach schnapps, showered over our velvety smooth peach ice.' },
      { name: 'Jack Da Ripper', price: '$13.95', desc: "Whiskey's smooth smoky caramel flavor blends perfectly with the sweet acidity of our cherry ice — a cocktail that finishes clean." },
      { name: 'Jinglin Baby', price: '$13.95', desc: "Our Piña Colada ice — the perfect blend of sweet pineapple and creamy coconut — served in a pool of Captain Morgan's pure cane, vanilla, and sweet spice rum." },
      { name: 'Loungin', price: '$13.95', desc: "St. Germain liqueur's light syrupy elderflower balanced with lemon zest, hints of pear and passion fruit, paired with our sweet-tart strawberry ice." },
      { name: 'Phenomenon', price: '$13.95', desc: 'The sweet tangy bite of our sour apple ice sets off the peppery taste of agave and the citrus-forward flavor of Patrón Silver Tequila.' },
      { name: 'Rock the Bells', price: '$13.95', desc: "E&J brandy's concord grape with a finish of caramel and oak, blending naturally with the deep dark berry flavor of our grape ice." },
    ],
  },
  {
    category: 'Wine',
    items: [
      { name: 'Chardonnay', price: '$7.00', desc: 'Big, bold flavor with a smooth finish — notes of crisp green apples, sweet peaches, honey, and vanilla.' },
      { name: 'Moscato', price: '$7.00', desc: 'Sweet and fruity with prominent flavors of juicy peach and apricot, with hints of citrus.' },
      { name: 'White Zinfandel', price: '$7.00', desc: 'A crisp, refreshing white with sweet fruity notes of peach and apricot.' },
      { name: 'Cabernet Sauvignon', price: '$7.00', desc: 'Smooth and balanced with notes of raspberry, blackberry, currant, and vanilla.' },
    ],
  },
  {
    category: 'Beer',
    items: [
      { name: 'Corona', price: '$7.50', desc: 'Light, crisp, and refreshing.' },
      { name: 'Heineken', price: '$6.50', desc: 'Crafted from premium malted barley, hops, and pure water for a crisp, clean finish.' },
    ],
  },
  {
    category: 'Coffees',
    items: [
      { name: "Bailey's Cream Coffee", price: '$11.50', desc: "Medium roast Colombian coffee sweetened with dark chocolate and Bailey's Irish Cream, served hot and topped with whipped cream and chocolate." },
      { name: 'Ice Cream Kahlúa', price: '$11.50', desc: 'Kahlúa blended with medium roast Colombian coffee, served over vanilla ice cream, topped with whipped cream and caramel sauce.' },
    ],
  },
  {
    category: 'By the Shot',
    items: [
      { name: 'Liquor Options', price: '$6.50–$12.00', desc: 'Select from a curated collection of premium spirits — whiskey, rum, vodka, cognac, gin, and more.' },
    ],
  },
];

export default function Menu() {
  const [tab, setTab] = useState('food');

  const sections = tab === 'food' ? FOOD : DRINKS;

  return (
    <div className="menu-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <p className="section-label">AfterDARK</p>
          <span className="blue-line" />
          <h1 className="display">Food <span className="text-blue">&</span> Drinks</h1>
          <p className="menu-hero__sub">
            Order at the bar or right from your table — we'll bring it to you.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="menu-tabs">
        <div className="container menu-tabs__inner">
          <button
            className={`menu-tab${tab === 'food' ? ' menu-tab--active' : ''}`}
            onClick={() => setTab('food')}
          >
            Food
          </button>
          <button
            className={`menu-tab${tab === 'drinks' ? ' menu-tab--active' : ''}`}
            onClick={() => setTab('drinks')}
          >
            Drinks
          </button>
        </div>
      </div>

      {/* Menu sections */}
      <section className="section">
        <div className="container">
          {sections.map((section) => (
            <ScrollReveal key={section.category}>
              <div className="menu-section">
                <h2 className="menu-section__title">
                  AfterDARK <span className="text-blue">{section.category}</span>
                </h2>
                {section.note && (
                  <p className="menu-section__note">{section.note}</p>
                )}
                <div className="menu-grid">
                  {section.items.map((item) => (
                    <div key={item.name} className="menu-card">
                      <div className="menu-card__top">
                        <span className="menu-card__name">{item.name}</span>
                        <span className="menu-card__price">{item.price}</span>
                      </div>
                      {item.desc && (
                        <p className="menu-card__desc">{item.desc}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}

          {/* Square order CTA */}
          <div className="menu-order-cta">
            <p className="menu-order-cta__text">Ready to order?</p>
            <a
              href={SQUARE_ORDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-blue"
            >
              Order Now →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
