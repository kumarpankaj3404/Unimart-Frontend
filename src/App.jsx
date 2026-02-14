import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import DeliveryPartnerDashboard from "./Pages/DeliveryPartnerDashboard";
import Items from "./Pages/Items";
import Profile from "./Pages/Profile";
import Orders from "./Pages/Orders";
import Addresses from "./Pages/SavedAddresses.jsx";
import Favourites from "./Pages/Favourites";
import About from "./Pages/About";
import NoActiveOrder from "./Pages/NoActiveOrder";
import NotFound from "./Pages/NotFound";
import Tracking from "./Pages/Tracking";
import "./App.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";


export default function App() {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
      root.classList.remove("light");
      document.body.classList.remove("light");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
      root.classList.add("light");
      document.body.classList.add("light");
    }
  }, [theme]);

  return (
    <Router>
      {/* Global SEO Configuration - Helmet Provider */}
      <Helmet>
        {/* Primary Meta Tags */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Brand & Description */}
        <meta name="application-name" content="Unimart" />
        <meta name="apple-mobile-web-app-title" content="Unimart" />
        <meta name="theme-color" content="#16A34A" />

        {/* Global Description */}
        <meta name="description" content="Unimart - Fast and reliable grocery delivery service. Order fresh vegetables, fruits, dairy products, snacks, and bakery items with same-day delivery. Get your groceries ASAP with Unimart." />

        {/* Global Keywords */}
        <meta name="keywords" content="unimart, unimart asap, unimart grocery, grocery delivery, online groceries, fresh vegetables, fruits delivery, dairy products online, fast grocery delivery, grocery shopping app, food delivery, instant delivery, organic groceries, grocery store near me" />

        {/* Author & Copyright */}
        <meta name="author" content="Unimart Team" />
        <meta name="copyright" content="© 2026 Unimart. All rights reserved." />

        {/* Search Engine Indexing */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Language & Region */}
        <meta name="language" content="English" />
        <meta httpEquiv="content-language" content="en-IN" />

        {/* Open Graph Meta Tags - Social Sharing */}
        <meta property="og:site_name" content="Unimart" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://unimart.com" />
        <meta property="og:title" content="Unimart - Grocery Delivery in Minutes | ASAP Delivery" />
        <meta property="og:description" content="Order fresh groceries online with same-day delivery. Unimart brings quality products from local farmers directly to your doorstep. Get it ASAP." />
        <meta property="og:image" content="https://unimart.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@UniMart" />
        <meta name="twitter:creator" content="@UniMart" />
        <meta name="twitter:title" content="UniMart - Fast Grocery Delivery" />
        <meta name="twitter:description" content="Order fresh groceries online with same-day delivery across major cities." />
        <meta name="twitter:image" content="https://unimart.com/twitter-image.jpg" />

        {/* Mobile App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://unimart.com" />

        {/* Alternate Language URLs */}
        <link rel="alternate" hrefLang="en-IN" href="https://unimart.com" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to External Domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdn.cloudflare.com" />
        <link rel="dns-prefetch" href="https://api.unimart.com" />

        {/* Schema.org Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "UniMart",
            "alternateName": "UniMart Grocery Delivery",
            "url": "https://unimart.com",
            "logo": "https://unimart.com/logo.png",
            "description": "Fast and reliable online grocery delivery service providing fresh vegetables, fruits, dairy, and bakery items.",
            "sameAs": [
              "https://www.facebook.com/UniMart",
              "https://www.instagram.com/UniMart",
              "https://www.twitter.com/UniMart",
              "https://www.linkedin.com/company/UniMart"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "telephone": "+91-XXXX-XXXX",
              "email": "support@unimart.com",
              "areaServed": ["IN"],
              "availableLanguage": ["en", "hi"]
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Your Business Address",
              "addressLocality": "Delhi",
              "addressRegion": "Delhi",
              "postalCode": "110001",
              "addressCountry": "IN"
            },
            "founder": {
              "@type": "Person",
              "name": "UniMart Team"
            },
            "foundingDate": "2024",
            "employees": {
              "@type": "Person",
              "name": "UniMart Team"
            }
          })}
        </script>

        {/* Schema.org Structured Data - Local Business */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "UniMart",
            "description": "Fast grocery delivery service with fresh, quality products",
            "image": "https://unimart.com/store-image.jpg",
            "url": "https://unimart.com",
            "telephone": "+91-XXXX-XXXX",
            "email": "support@unimart.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Your Address",
              "addressLocality": "Delhi",
              "postalCode": "110001",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "28.7041",
              "longitude": "77.1025"
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              "opens": "06:00",
              "closes": "23:00"
            },
            "priceRange": "₹",
            "areaServed": ["Delhi", "NCR"],
            "serviceType": ["Grocery Delivery", "Food Delivery"],
            "hasMap": "https://maps.google.com/?q=unimart",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "2500"
            }
          })}
        </script>

        {/* Schema.org Structured Data - E-commerce Site */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://unimart.com",
            "name": "UniMart",
            "description": "Online grocery delivery platform",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://unimart.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* Breadcrumb Navigation Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://unimart.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://unimart.com/items"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Cart",
                "item": "https://unimart.com/checkout"
              }
            ]
          })}
        </script>
      </Helmet>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/login-selection" element={<LoginSelection />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/about" element={<About />} />
        <Route path="/items" element={<Items />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/no-active-order" element={<NoActiveOrder />} />
        <Route path="/delivery-partner-dashboard/*" element={<DeliveryPartnerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}