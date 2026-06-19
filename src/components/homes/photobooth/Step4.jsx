import React, { useState } from 'react';
import { Grid, TextField } from '@mui/material';
import Image from "next/image";
import Atlass from '../../../public/assets/img/about/Atlass2.svg'


const Step4 = ({ prevStep, handleChange, handleSubmit }) => {
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleOccasionChange = (occasion) => {
    setSelectedOccasion(occasion);
    handleChange({ target: { name: 'occasion', value: occasion } });
  };

  const handleStartTimeChange = (event) => {
    const { value } = event.target;
    setStartTime(value);
    handleChange({ target: { name: 'startTime', value } });
  };

  const handleEndTimeChange = (event) => {
    const { value } = event.target;
    setEndTime(value);
    handleChange({ target: { name: 'endTime', value } });
  };

  return (

    <div className="container" style={{paddingBottom:"30px"}} id="StepForm">
    <div className="row">
      <div className="col-lg-8" style={{ padding: "0", paddingLeft:"-100px" }}>
        <Image src={Atlass} height={100} width={100} alt="vfvbg" style={{ height: "90vh", width: "100%" }} />
      </div>
    <div className="col-lg-4" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", padding: "0" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", padding: "20px" }}>
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

        <label className="form-label">What's the Occasion? *</label>
        <div className="button-group">
          {['Wedding', 'Corporate', 'Birthday', 'Holiday', 'School', 'Other'].map((occasion) => (
            <button
              key={occasion}
              type="button"
              onClick={() => handleOccasionChange(occasion)}
              className={`form-button ${selectedOccasion === occasion ? 'selected' : ''}`}
            >
              {occasion}
            </button>
          ))}
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="form-label">Start Time *</label>
            <TextField
              fullWidth
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="form-group">
            <label className="form-label">End Time *</label>
            <TextField
              fullWidth
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </div>
        </Grid>
      </Grid>

      <div className="button-group nav-buttons">
        <button type="button" onClick={prevStep} className="form-nav-button">
          Previous
        </button>
        <button type="submit" className="form-nav-button">
          Get My Quote
        </button>
      </div>
    </form>
</div>
</div>
</div>
    
  );
};

export default Step4;
