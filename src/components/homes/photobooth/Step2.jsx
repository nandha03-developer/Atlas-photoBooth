import React, { useState } from 'react';
import Atlass from '../../../public/assets/img/about/Atlass2.svg'
import Image from "next/image";
const Step2 = ({ nextStep, prevStep, handleChange, values }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [durationError, setDurationError] = useState('');

  const handleDateChange = (e) => {
    const date = e.target.value;
    setStartDate(date);
    handleChange({ target: { name: 'eventDate', value: date } });
  };

  const handleDurationChange = (duration) => {
    handleChange({ target: { name: 'rentalDuration', value: duration } });
    setDurationError(''); // Reset error when a duration is selected
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.rentalDuration) {
      setDurationError('Please select the duration');
      return;
    }
    nextStep();
  };

  return (

<> 
   
  <div className="container" style={{paddingBottom:"30px"}} id="StepForm">
  <div className="row">
  <div className="col-lg-8" style={{ padding: "0", paddingLeft:"-100px" }}>
        <Image src={Atlass} height={100} width={100} alt="vfvbg" style={{ height: "90vh", width: "100%" }} />
      </div>
  <div className="col-lg-4" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", padding: "0" }}>
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
      <h2 className="form-title" style={{ color: "purple", textAlign: "center" }}>Request a Quote</h2>
      <p className="form-subtitle" style={{ textAlign: "center" }}>* indicates required fields</p>
      <div className="form-group">
        <label className="form-label">Event Date (optional)</label>
        <input
          value={startDate}
          onChange={handleDateChange}
          className="form-input"
          type='date'
        />
      </div>
      <div className="form-group">
        <label className="form-label">Rental Duration *</label>
        <div className="button-group">
          {['3 Hours', '4 Hours', '5 Hours', '6 Hours'].map((duration) => (
            <button
              key={duration}
              type="button"
              onClick={() => handleDurationChange(duration)}
              className={`form-button ${values.rentalDuration === duration ? 'selected' : ''}`}
            >
              {duration}
            </button>
          ))}
        </div>
        {durationError && <p className="error-message" style={{ color: 'red' }}>{durationError}</p>}
      </div>
      <div className="button-group">
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
    </>
  );
};

export default Step2;
