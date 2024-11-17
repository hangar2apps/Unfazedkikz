import React, { useState, useEffect } from "react";
import "./CustomStyles.css";

function Upload(props) {
  const [shoeBrand, setShoeBrand] = useState("");
  const [shoeLine, setShoeLine] = useState("");
  const [shoeModel, setShoeModel] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);


  //use to delete shoes for testing
  useEffect(() => {
    console.log('in Upload.js useEffect', props);
    const deleteShoes = async () => {
      const response = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      console.log("response", response);

      if (!response.ok) {
        throw new Error("Failed to delete shoe");
      }

      console.log("Shoe deleted successfully");
    };

    deleteShoes();
  }, [props])

  useEffect(() => {
    console.log('uploadedImageUrl', uploadedImageUrl);
  }, [uploadedImageUrl])


  const handleShoeBrandChange = (e) => {
    console.log("handleShoeBrandChange", e);
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
          shoeBrand,
          shoeLine,
          shoeModel,
          imageData: previewUrl,
        }),
      });
      console.log("response", response);

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      console.log('data', data);

      setUploadedImageUrl(data.url);


      new Promise(resolve => setTimeout(resolve, 10000));
      // alert("Image uploaded successfully!");
      clearForm();
    } catch (error) {
      console.error("Error uploading image:", error);
      // alert("Hmm, something went wrong. Make sure this image is not already uploaded.");
    } finally {
      setUploading(false);
    }
  };

  const clearForm = () => {
    setShoeBrand("");
    setShoeLine("");
    setShoeModel("");
    setFile(null);
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    // Reset the file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
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
                // disabled={uploading}
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
                // disabled={uploading}
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
                // disabled={uploading}
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
                // disabled={uploading}
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
                id="uploadButton"
                type="submit"
                className="btn custom-btn text-white"
              >Upload Shoe
              </button>
              {/* <button
                type="submit"
                className="btn custom-btn text-white"
                // disabled={
                //   !shoeBrand || !shoeLine || !shoeModel || !file || uploading
                // }
              >
                {uploading ? (
                  <>
                    <span className="spinner me-2"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Shoe"
                )}{" "}
              </button> */}
              <button
                id="clearButton"
                type="button"
                className="btn btn-outline-light"
                onClick={clearForm}
                // disabled={uploading}
              >
                Clear Form
              </button>
            </div>
            {uploadedImageUrl ? (
              <div className="mt-3 text-center">
                <p className="upload-success text-success">Image uploaded successfully!</p>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
