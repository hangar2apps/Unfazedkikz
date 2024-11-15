import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import FeaturedKicks from "./FeaturedKicks";
// import ShoeOfWeek from "./ShoeOfWeek";
import Footer from "./Footer";

function Home(props) {
  const [shoeBrands, setShoeBrands] = useState();
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    setShoes([
      {
        ID: "35d9736a-a67c-4e92-83bf-59c31db19f57",
        ShoeBrand: "Asics",
        ShoeLine: "Gel Kahana",
        ShoeModel: "TR V4",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg",
      },
      {
        ID: "9fa1ab7e-ad5a-4954-8f25-1870154c4f3b",
        ShoeBrand: "New Balance",
        ShoeLine: "9060",
        ShoeModel: "Artic Grey",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Artic%20Grey.jpg",
      },
      {
        ID: "35d9736a-a67c-4e92-83bf-59c31db19f57",
        ShoeBrand: "Asics",
        ShoeLine: "Gel Kahana",
        ShoeModel: "TR V4",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg",
      },
      {
        ID: "9fa1ab7e-ad5a-4954-8f25-1870154c4f3b",
        ShoeBrand: "New Balance",
        ShoeLine: "9060",
        ShoeModel: "Artic Grey",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Artic%20Grey.jpg",
      },
      {
        ID: "35d9736a-a67c-4e92-83bf-59c31db19f57",
        ShoeBrand: "Asics",
        ShoeLine: "Gel Kahana",
        ShoeModel: "TR V4",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg",
      },
      {
        ID: "9fa1ab7e-ad5a-4954-8f25-1870154c4f3b",
        ShoeBrand: "New Balance",
        ShoeLine: "9060",
        ShoeModel: "Artic Grey",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Artic%20Grey.jpg",
      },
      {
        ID: "35d9736a-a67c-4e92-83bf-59c31db19f57",
        ShoeBrand: "Asics",
        ShoeLine: "Gel Kahana",
        ShoeModel: "TR V4",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg",
      },
      {
        ID: "9fa1ab7e-ad5a-4954-8f25-1870154c4f3b",
        ShoeBrand: "New Balance",
        ShoeLine: "9060",
        ShoeModel: "Artic Grey",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Artic%20Grey.jpg",
      },
      {
        ID: "35d9736a-a67c-4e92-83bf-59c31db19f57",
        ShoeBrand: "Asics",
        ShoeLine: "Gel Kahana",
        ShoeModel: "TR V4",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg",
      },
      {
        ID: "9fa1ab7e-ad5a-4954-8f25-1870154c4f3b",
        ShoeBrand: "New Balance",
        ShoeLine: "9060",
        ShoeModel: "Artic Grey",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Artic%20Grey.jpg",
      },
      {
        ID: "35d9736a-a67c-4e92-83bf-59c31db19f57",
        ShoeBrand: "Asics",
        ShoeLine: "Gel Kahana",
        ShoeModel: "TR V4",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg",
      },
      {
        ID: "9fa1ab7e-ad5a-4954-8f25-1870154c4f3b",
        ShoeBrand: "New Balance",
        ShoeLine: "9060",
        ShoeModel: "Artic Grey",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Artic%20Grey.jpg",
      },
      {
        ID: "35d9736a-a67c-4e92-83bf-59c31db19f57",
        ShoeBrand: "Asics",
        ShoeLine: "Gel Kahana",
        ShoeModel: "TR V4",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg",
      },
      {
        ID: "9fa1ab7e-ad5a-4954-8f25-1870154c4f3b",
        ShoeBrand: "New Balance",
        ShoeLine: "9060",
        ShoeModel: "Artic Grey",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Artic%20Grey.jpg",
      },
      {
        ID: "35d9736a-a67c-4e92-83bf-59c31db19f57",
        ShoeBrand: "Asics",
        ShoeLine: "Gel Kahana",
        ShoeModel: "TR V4",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg",
      },
      {
        ID: "9fa1ab7e-ad5a-4954-8f25-1870154c4f3b",
        ShoeBrand: "New Balance",
        ShoeLine: "9060",
        ShoeModel: "Artic Grey",
        URL: "https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Artic%20Grey.jpg",
      },
    ])
    setShoeBrands(["Asics", "New Balance"])
  }, [])
  

  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        {/* <ShoeOfWeek /> */}
        <FeaturedKicks shoeBrands={shoeBrands} shoes={shoes} />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
