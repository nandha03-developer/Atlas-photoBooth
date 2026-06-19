import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const steps = ["Step 1", "Step 2", "Step 3"];

const StepperForm = () => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit(onSubmit)(); // Submit form data
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data) => {
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Controller
            name="step1Field"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Step 1 Field"
                error={!!errors.step1Field}
                helperText={errors.step1Field?.message}
              />
            )}
          />
        );
      case 1:
        return (
          <Controller
            name="step2Field"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Step 2 Field"
                error={!!errors.step2Field}
                helperText={errors.step2Field?.message}
              />
            )}
          />
        );
      case 2:
        return (
          <Controller
            name="step3Field"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Step 3 Field" />
            )}
          />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {renderStepContent(activeStep)}
        <div>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepperForm;
