# MS Dhoni - The Legend | Cinematic Tribute Website

![MS Dhoni Tribute](https://wallpapercave.com/wp/wp14945415.webp)

A premium, interactive, and cinematic tribute website dedicated to **Mahendra Singh Dhoni**, celebrating his legacy, achievements, and impact on world cricket. Built with modern web technologies to deliver an immersive fan experience.

## 🌟 Key Features

- **🎬 Cinematic Hero Section**: Dynamic masonry layout with parallax scrolling and "Golden Hour" lighting effects.
- **🗣️ Legends on the Legend**: A curated collection of 50+ quotes from cricket legends, visualized in a comic-style masonry grid.
- **🏏 Career Timeline**: Interactive vertical scroll timeline highlighting key milestones (2007 T20 WC, 2011 ODI WC, 2013 CT).
- **📊 Stats & Records**: Detailed visualization of his ODI, Test, T20I, and IPL statistics.
- **😂 Thala For A Reason**: A fun, interactive meme page that checks if your input equals "7" with audio feedback.
- **✒️ Fan Guestbook**: A real-time message board for fans to leave tributes (powered by MongoDB).
- **🏆 Awards & Honors**: A showcase of national honors and cricketing awards.
- **🔥 Iconic Moments Page**: Dedicated highlight page for defining match moments.
- **🧠 Captaincy Lab**: Interactive tactical decision scenarios inspired by Dhoni's leadership.
- **🌌 Fan Universe (Sub Feature)**: Community interaction zone that complements (not replaces) the tribute core.
- **📰 Free API News Feed**: News route now supports free GNews API integration with fallback data.
- **⏱️ Pressure Mode**: Last-over chase simulator based on Dhoni's finishing composure.
- **📅 On This Day**: Daily Dhoni-related history feed from free Wikipedia API (with fallback).
- **🖼️ Supremacy Cards**: Share-ready tribute card caption generator.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **External API**: [GNews](https://gnews.io/) (free tier)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Font**: Google Fonts (Geist, Inter)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Connection String (Atlas or Local)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/ms-dhoni-tribute.git
    cd ms-dhoni-tribute
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Use `.env.example` as the single env template and copy values into Vercel Project Settings:
    ```env
    MONGODB_URI=your_mongodb_connection_string_here
    GNEWS_API_KEY=your_gnews_api_key_here
    GNEWS_QUERY=MS Dhoni OR Chennai Super Kings
    GNEWS_COUNTRY=in
    GNEWS_MAX_RESULTS=10
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
├── src
│   ├── app          # Next.js App Router pages
│   ├── components   # Reusable UI components
│   │   ├── layout   # Navbar, Footer
│   │   ├── ui       # Core UI elements (Cards, Buttons)
│   ├── models       # Mongoose Database Models
│   ├── lib          # Utility functions & DB connection
│   └── styles       # Global styles
├── public           # Static assets (images, audio)
└── ...config files
```

## 🌍 Deployment

The project is optimized for deployment on [Vercel](https://vercel.com).

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the `MONGODB_URI` environment variable in Vercel settings.
4.  Deploy!

## 👨‍💻 Created By

**Amritanshu Yadav**  
*A tribute to the greatest captain of all time.*

---
*"Definitively Thala."* 🦁💛
