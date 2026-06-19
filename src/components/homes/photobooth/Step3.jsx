import React, { useState, useEffect } from "react";
import Image from "next/image";
import Atlass from '../../../public/assets/img/about/Atlass2.svg'

const Step3 = ({
  nextStep,
  prevStep,
  handleChange,
  values = { package: "" },
}) => {
  const [selectedPackage, setSelectedPackage] = useState(values.package);
  const [packageError, setPackageError] = useState(false);

  useEffect(() => {
    setSelectedPackage(values.package);
  }, [values.package]);

  const handlePackageChange = (pkg) => {
    setSelectedPackage(pkg);
    handleChange({ target: { name: "package", value: pkg } });
    setPackageError(false); // Reset error when a package is selected
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPackage) {
      setPackageError(true);
      return;
    }
    nextStep();
  };

  return (
    <div className="container" style={{paddingBottom:"30px"}} id="StepForm">
    <div className="row">
      <div className="col-lg-8" style={{ padding: "0", paddingLeft:"-100px" }}>
        <Image src={Atlass} height={100} width={100} alt="vfvbg" style={{ height: "90vh", width: "100%" }} />
      </div>
    <div
      className="col-lg-4"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "0",
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: "100%", padding: "20px" }} >
        <style jsx>{`
          .form-input:focus {
            border-color: purple;
            outline-color: purple;
          }
          .form-nav-button {
            background-color: purple;
            color: white;
          }
          .form-nav-button:hover {
            background-color: darkpurple;
          }
          .form-button {
            color: purple;
          }
          .form-button:hover {
            background-color: purple;
            color: white;
          }
          .form-button.selected {
            background-color: purple;
            color: white;
          }
        `}</style>
        <h2 className="form-title" style={{ color: "purple", textAlign: "center" }}>
          Request a Quote
        </h2>
        <p className="form-subtitle" style={{ textAlign: "center" }}>* indicates required fields</p>
        <div className="form-group">
          <label className="form-label">Photo Booths *</label>
          <div className="button-group">
            {["Tourist", "Atlantis", "Celestial"].map((pkg) => (
              <button
                key={pkg}
                type="button"
                onClick={() => handlePackageChange(pkg)}
                className={`form-button ${
                  selectedPackage === pkg ? "selected" : ""
                }`}
              >
                {pkg}
              </button>
            ))}
          </div>
          {packageError && (
            <p className="error-message" style={{ color: "red" }}>
              Please select a package
            </p>
          )}
        </div>
        <div className="button-group nav-buttons">
          <button type="button" onClick={prevStep} className="form-nav-button">
            Previous
          </button>
          <button type="submit" className="form-nav-button">
            Next
          </button>
        </div>
      </form>
    </div>
    </div>
    </div>
  );
};

export default Step3;
