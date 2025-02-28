import React from "react";


const services = [
  {
    category: "Bleach",
    items: [
      { name: "Face & Neck", price: "₹249" },
      { name: "Full Arms", price: "₹399" },
      { name: "Full Legs", price: "₹399" },
      { name: "Full Back/Front", price: "₹499" },
      { name: "Full Body", price: "₹1999" },
      { name: "Full Neck Blues Line", price: "₹499" }
    ]
  },
  {
    category: "D-Tan",
    items: [
      { name: "Face & Neck", price: "₹450" },
      { name: "Full Arms", price: "₹950" },
      { name: "Full Legs", price: "₹950" },
      { name: "Full Back/Front", price: "₹850" },
      { name: "Full Neck Blues Line", price: "₹600" },
      { name: "Full Body", price: "₹3000" }
    ]
  },
  {
    category: "Threading",
    items: [
      { name: "Upper Lips", price: "₹30" },
      { name: "Lower Lips", price: "₹20" },
      { name: "Chin", price: "₹20" },
      { name: "Side Look", price: "₹30" },
      { name: "Forehead", price: "₹30" },
      { name: "Full Face", price: "₹100" }
    ]
  },
  {
    category: "Facial",
    items: [
      { name: "Ayurveda Facial", price: "₹699 - ₹1199" },
      { name: "Fruit / Papaya / Wine / Diamond Facial", price: "₹999 - ₹1299" },
      { name: "Aroma Magic Facial", price: "₹1399 - ₹1699" },
      { name: "Lotus Facial", price: "₹2800" },
      { name: "O3+ Whitening Facial", price: "₹950 - ₹1499" },
      { name: "Nature’s Gold Facial", price: "Custom Pricing" }
    ]
  },
  {
    category: "Waxing",
    items: [
      { name: "Full Arms", price: "₹300" },
      { name: "Full Legs", price: "₹500" },
      { name: "Full Body", price: "₹1500" }
    ]
  },
  {
    category: "Manicure / Pedicure",
    items: [
      { name: "Hand", price: "₹550" },
      { name: "Foot", price: "₹750" }
    ]
  },
  {
    category: "Hair Cut",
    items: [
      { name: "Straight Cut", price: "₹100" },
      { name: "U Cut / V Cut", price: "₹150" },
      { name: "Layer", price: "₹349" },
      { name: "Multi Layer", price: "₹499" },
      { name: "Advance Cut", price: "₹649" }
    ]
  },
  {
    category: "Hair Treatment",
    items: [
      { name: "Anti-Dandruff", price: "₹1499" },
      { name: "Hair Fall", price: "₹1999" },
      { name: "Spa", price: "₹699" },
      { name: "Rebonding / Smoothening / Keratin", price: "₹2999" }
    ]
  },
  {
    category: "Hair Coloring",
    items: [
      { name: "Root Touchup with Wash", price: "₹700" },
      { name: "Root Touchup without Wash", price: "₹500" },
      { name: "Global Hair Color", price: "₹2500-₹4000" },
      { name: "Base Hair Color", price: "₹2000-₹3500" },
      { name: "Per Streaks", price: "₹200-₹300" }
    ]
  },
  {
    category: "Makeup Services",
    items: [
      { name: "Basic Party Makeup", price: "₹1500" },
      { name: "Advance Party Makeup", price: "₹2300" },
      { name: "Airbrush Party Makeup", price: "₹5000" },
      { name: "HD Party Makeup", price: "₹4000" },
      { name: "Engagement Makeup (Manual)", price: "₹5000" },
      { name: "Engagement Makeup (Airbrush)", price: "₹9000" },
      { name: "Bridal Makeup (Manual)", price: "₹8000" },
      { name: "Bridal Makeup (Airbrush)", price: "₹15000" },
      { name: "Bridal Makeup (HD)", price: "₹12000" }
    ]
  },
  {
    category: "Bridal Packages",
    items: [
      { name: "Package 1 - HD Makeup + Skincare", price: "₹25,000" },
      { name: "Package 2 - Airbrush Makeup + Skincare", price: "₹30,000" }
    ]
  }
];

const ServicesPage = () => {
  return (
    <div className="services-container">
      {/* Beauty Point Makeup Studio Heading */}
      <h1 className="studio-heading">Beauty Point Makeup Studio</h1>

      {/* Services Header */}
      <h2 className="services-header">Our Services</h2>

      {/* Loop through each service category */}
      {services.map((service, index) => (
        <div key={index} className="service-category">
          <h3 className="category-title">{service.category}</h3>
          <ul className="service-list">
            {service.items.map((item, idx) => (
              <li key={idx} className="service-item">
                <span className="service-name">{item.name}</span>
                <span className="service-price">{item.price}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ServicesPage;
