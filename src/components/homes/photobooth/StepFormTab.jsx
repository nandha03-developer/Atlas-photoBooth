'use client'
import { useState } from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const StepperForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    email: "",
    eventDate: "",
    rentalDuration: "",
    package: "",
    occasion: "",
    startTime: "",
    endTime: "",
  });

  const steps = ['Step 1', 'Step 2', 'Step 3'];

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (data) => {
    const finalData = { ...formData, ...data };
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Step1 onNext={handleNext} values={formData}/>;
      case 1:
        return <Step2 onNext={handleNext} onBack={handleBack} values={formData}/>;
      case 2:
        return <Step3 onSubmit={handleSubmit} onBack={handleBack} values={formData}/>;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {getStepContent(activeStep)}
      </Box>
    </Box>
  );
};

export default StepperForm;