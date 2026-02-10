// Single source of truth for all district links + copy.
window.AGEX_CONFIG = {
  // Constitution
  charterUrl: "https://charlesarin101.github.io/the-stewards-charter/",

  // Gate (Application)
  applyUrl: "https://forms.gle/xDAeYySw4aQ3UWSYA",

  districts: [
    {
      id: "charter",
      icon: "🏛️",
      name: "The Charter District",
      one: "The constitution of stewardship—law before labor, doctrine before expansion.",
      quote: "Order is love made visible.",
      url: "https://charlesarin101.github.io/the-stewards-charter/",
      x: "8%", y: "16%"
    },

    // ✅ IMPORTANT CHANGE: Financial district now goes to public gate / landing page
    {
      id: "finance",
      icon: "🦈",
      name: "The Financial District",
      one: "The public gate into disciplined capital—enter here before the inner Lodge.",
      quote: "Money is a tool. Stewardship is the craft.",
      url: "https://charlesarin101.github.io/agex-smartmoneyhub/",
      x: "58%", y: "14%"
    },

    {
      id: "academy",
      icon: "🧠",
      name: "The Academy",
      one: "Training the mind—formation of discipline, thinking, and responsibility.",
      quote: "A future is built first in the mind.",
      url: "https://charlesarin101.github.io/christianchildacademy_zaria/",
      x: "10%", y: "58%"
    },

    {
      id: "lab",
      icon: "⚗️",
      name: "The Lab",
      one: "Sanctioned experimentation—testing models, refining systems, forging tools.",
      quote: "Innovation without chaos. Proof before scale.",
      url: "https://charlesarin101.github.io/Income_streams_lab/",
      x: "58%", y: "58%"
    },

    {
      id: "provisions",
      icon: "📦",
      name: "The Provisions",
      one: "The supply district—durable resources for builders, not consumers.",
      quote: "Buy less. Choose well. Build longer.",
      url: "https://charlesarin1-creator.github.io/the-stigweards-provisions/",
      x: "34%", y: "36%"
    }
  ]
};
