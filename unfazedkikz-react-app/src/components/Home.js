import React, { useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import FeaturedKicks from "./FeaturedKicks";
import ShoeOfWeek from "./ShoeOfWeek";
import Footer from "./Footer";

function Home(props) {
  const [shoeBrands, setShoeBrands] = useState(["Asics", "New Balance"]);
  const [shoes, setShoes] = useState([
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
  ]);

  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <FeaturedKicks shoeBrands={shoeBrands} shoes={shoes} />
        {/* <ShoeOfWeek /> */}
        {/* <div className="container">
            {shoeBrands.map((brand, index) => (
              <React.Fragment key={brand}>
                <h2 className="col-12 mt-4">{brand}</h2>
                <div className="row shoe-row">
                {shoes
                  .filter((shoe) => {
                    return shoe.ShoeBrand === brand;
                  })
                  .map((shoe, index) => (
                    <div className="col-md-4 shoe-card" key={shoe.ID}>
                      <div className="card h-100">
                        <img
                          src={shoe.URL}
                          className="card-img-top"
                          alt={shoe.ShoeBrand}
                        />
                        <div className="card-body">
                          <h5 className="card-title text-white">
                            {shoe.ShoeBrand}
                          </h5>
                          <p className="card-text text-white">{shoe.ShoeLine}</p>
                          <button className="btn btn-primary w-100">
                            Inquire
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </React.Fragment>
            ))}
        </div> */}
      </main>
      <Footer />
    </div>
  );
}

export default Home;
