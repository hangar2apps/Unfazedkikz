import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./CustomStyles.css";

function Upload(props) {
  const [shoeBrand, setShoeBrand] = useState("");
  const [shoeLine, setShoeLine] = useState("");
  const [shoeModel, setShoeModel] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allShoes, setAllShoes] = useState([]);
  const [shoeToDelete, setShoeToDelete] = useState("");

  const getShoes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getShoes");
      const data = await response.json();
      console.log("data in Upload.js", data);
      if (data.shoeBrands.length === 0) {
        console.log("no shoes found");
      } else {
        setAllShoes(data.shoes);
        setShoeToDelete(
          data.shoes[0].ShoeBrand +
            "/" +
            data.shoes[0].ShoeLine +
            "/" +
            data.shoes[0].ShoeModel
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching shoes:", error);
    }
  };

  useEffect(() => {
    getShoes();

    // for testing
    // setAllShoes([
    //   {
    //     ID: 1,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Rain Loud Grey',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Rain%20Cloud%20Grey.jpg',
    //   },
    //   {
    //     ID: 2,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Arctic Grey',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Arctic%20Grey.jpg',
    //   },
    //   {
    //     ID: 3,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Beach Glass',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Beach%20Glass.jpg',
    //   },
    //   {
    //     ID: 4,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '9060',
    //     ShoeModel: 'Beef and Broccoli',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/9060/Beef%20and%20Broccoli.jpg',
    //   },
    //   {
    //     ID: 5,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '990',
    //     ShoeModel: 'Black White',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Black%20White.jpg',
    //   },
    //   {
    //     ID: 6,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '990',
    //     ShoeModel: 'Joe Freshgoods',
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Joe%20Freshgoods.jpg',
    //   },
    //   {
    //     ID: 7,
    //     ShoeBrand: 'New Balance',
    //     ShoeLine: '990',
    //     ShoeModel: "Olive",
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/New%20Balance/990/Olive.jpg',
    //   },
    //   {
    //     ID: 8,
    //     ShoeBrand: 'Asics',
    //     ShoeLine: 'Gel Kahana',
    //     ShoeModel: "TR V4",
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4.jpg',
    //   },
    //   {
    //     ID: 9,
    //     ShoeBrand: 'Asics',
    //     ShoeLine: 'Gel Kahana',
    //     ShoeModel: "TR V4 Silver Red",
    //     URL: 'https://raw.githubusercontent.com/hangar2apps/Unfazedkikz/v1/shoes/Asics/Gel%20Kahana/TR%20V4%20Silver%20Red.jpg',
    //   },
    // ]);
    // setShoeToDelete('New Balance/9060/Rain Loud Grey');
  }, []);

  const handleShoeBrandChange = (e) => {
    setShoeBrand(e.target.value);
  };

  const handleShoeLineChange = (e) => {
    setShoeLine(e.target.value);
  };

  const handleShoeModelChange = (e) => {
    setShoeModel(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shoeBrand || !shoeLine || !shoeModel || !file) return;

    setUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shoeBrand: shoeBrand.trim(),
          shoeLine: shoeLine.trim(),
          shoeModel: shoeModel.trim(),
          imageData: previewUrl,
        }),
      });

      if (response.status !== 200) {
        throw new Error(
          `Failed to upload image: ${shoeBrand}, ${shoeLine}, ${shoeModel}`
        );
      }
      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: `Upload successful!`,
        text: ``,
      });
      clearForm();
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: `Upload failed!`,
        text: ``,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleShoeDelete = async (e) => {
    e.preventDefault();
    setUploading(true);
    console.log("shoe to delete", shoeToDelete);

    try {
      const response = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shoeToDelete: shoeToDelete,
        }),
      });

      if (response.status !== 200) {
        throw new Error(`Failed to remove: ${shoeToDelete}`);
      }

      Swal.fire({
        icon: "success",
        title: `${shoeToDelete} removed!`,
        text: ``,
      });
    } catch (error) {
      console.error(`Error removing ${shoeToDelete}`, error);
      Swal.fire({
        icon: "error",
        title: `Error removing ${shoeToDelete}`,
        text: ``,
      });
    } finally {
      getShoes();
      setUploading(false);
    }
  };

  const clearForm = () => {
    setShoeBrand("");
    setShoeLine("");
    setShoeModel("");
    setFile(null);
    setPreviewUrl(null);
    // Reset the file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  console.log("all shoes", allShoes);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="mb-1">-- Hints --</div>
          <div className="mb-1">
            Check that spelling is correct and matches what is on the website.
          </div>
          <div className="mb-1">
            Make sure there are no spaces before or after the file name.
          </div>
          <div>-- Example --</div>
          <div className="mb-1">
            Shoe Brand: Asics - if this brand doesn't exist then this should
            make a new section
          </div>
          <div className="mb-1">
            Shoe Line: Gel Kayano 14 - if this line doesn't exist then this
            should make a new section within the above brand
          </div>
          <div className="mb-1">
            Shoe Model: Silver Black Pink - this should be displayed in the card
            below the shoe image
          </div>
          <form onSubmit={handleSubmit} className="p-4 custom-form">
            <div className="mb-3">
              <label htmlFor="shoeBrand" className="form-label">
                Shoe Brand
              </label>
              {/* <select className="form-control custom-input" value={shoeBrand} onChange={handleShoeBrandChange} required disabled={uploading} placeholder="Enter shoe brand">
                {props && props.shoeBrands && props.shoeBrands.length > 0 && props.shoeBrands.map((shoeBrand) => (
                  <option key={shoeBrand} value={shoeBrand}>
                    {shoeBrand}
                  </option>
                ))}
              </select> */}
              <input
                id="shoeBrand"
                type="text"
                className="form-control custom-input"
                value={shoeBrand}
                onChange={handleShoeBrandChange}
                required
                disabled={uploading}
                placeholder="Enter shoe brand"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="shoeLine" className="form-label">
                Shoe Line
              </label>
              <input
                id="shoeLine"
                type="text"
                className="form-control custom-input"
                value={shoeLine}
                onChange={handleShoeLineChange}
                required
                disabled={uploading}
                placeholder="Enter shoe line"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="shoeModel" className="form-label">
                Shoe Model
              </label>
              <input
                id="shoeModel"
                type="text"
                className="form-control custom-input"
                value={shoeModel}
                onChange={handleShoeModelChange}
                required
                disabled={uploading}
                placeholder="Enter shoe model"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Shoe Image
              </label>
              <input
                id="image"
                type="file"
                className="form-control custom-input custom-file-input"
                accept="image/*"
                onChange={handleFileChange}
                required
                disabled={uploading}
              />
            </div>
            {previewUrl && (
              <div className="mb-3">
                <img
                  id="previewImage"
                  src={previewUrl}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center">
              <button
                type="submit"
                className="btn custom-btn text-white"
                disabled={
                  !shoeBrand || !shoeLine || !shoeModel || !file || uploading
                }
              >
                {uploading ? (
                  <>
                    <span className="spinner me-2"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Shoe"
                )}{" "}
              </button>
              <button
                id="clearButton"
                type="button"
                className="btn btn-outline-light"
                onClick={clearForm}
                disabled={uploading}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <form className="p-4 custom-form">
            <div className="mb-3">
              <label htmlFor="shoeBrand" className="form-label">
                Shoe To Remove
              </label>
              <select
                className="form-control custom-input"
                value={shoeToDelete}
                onChange={(e) => console.log("shoe to delete", e.target.value)}
                required
                disabled={uploading}
                placeholder="Select shoe to remove"
              >
                {allShoes &&
                  allShoes.length > 0 &&
                  allShoes.map((shoe) => (
                    <option
                      key={shoe.ID}
                      value={`${shoe.ShoeBrand}/${shoe.ShoeLine}/${shoe.ShoeModel}`}
                    >
                      {`${shoe.ShoeBrand} ${shoe.ShoeLine} ${shoe.ShoeModel}`}
                    </option>
                  ))}
              </select>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <button
                onClick={(e) => handleShoeDelete(e)}
                className="btn custom-btn text-white"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="spinner me-2"></span>
                    Removing Shoe...
                  </>
                ) : (
                  "Remove Shoe"
                )}{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
