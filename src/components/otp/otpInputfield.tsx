// import React from "react";

// import Styles from "../../public/assets/css/otpInput.module.css";
// const OtpInputGroup = ({ setInputValues, inputValues = {} }: any) => {
//   const handleInputChange = (inputId: any, value: any) => {
//     setInputValues((prevInputValues: any) => ({
//       ...prevInputValues,
//       [inputId]: value,
//     }));
   
//   };

//   return (
//     <>
//       <div
//         id="OTPInputGroup"
//         className={Styles.digitGroup}
//         data-autosubmit="true"
//       >
//         {Object.keys(inputValues).map((inputId, index) => {
//           return (
//             <OTPInput
//               key={index}
//               id={inputId}
//               value={inputValues[inputId]}
//               onValueChange={handleInputChange}
//               previousId={index > 0 ? `input${index}` : null}
//               nextId={
//                 index < Object.keys(inputValues).length - 1
//                   ? `input${index + 2}`
//                   : ""
//               }
//             />
//           );
//         })}
//       </div>
//     </>
//   );
// };

// const OTPInput = ({ id, previousId, nextId, value, onValueChange }: any) => {
//   const handleKeyUp = (e: any) => {
//     if (previousId && (e.keyCode === 8 || e.keyCode === 37)) {
//       const prev = document.getElementById(previousId);
//       if (prev) {
//         prev.focus();
//       }
//     } else if (
//       nextId &&
//       nextId !== "" &&
//       ((e.keyCode >= 48 && e.keyCode <= 57) ||
//         (e.keyCode >= 65 && e.keyCode <= 90) ||
//         (e.keyCode >= 96 && e.keyCode <= 105) ||
//         e.keyCode === 39)
//     ) {
//       const next = document.getElementById(nextId);
//       if (next) {
//         next.focus();
//       }
//     } else {
//       const inputGroup = document.getElementById("OTPInputGroup");
//       if (inputGroup && inputGroup.dataset["autosubmit"]) {
//       }
//     }
//   };

//   const handlePaste = (e: any) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData("text");
//     if (pastedData.length === 6) {
//       const inputs = document.querySelectorAll<HTMLInputElement>(".OTPInput");
//       if (inputs.length === 6) {
//         inputs.forEach((input, index) => {
//           input.value = pastedData[index];
//           onValueChange(`input${index + 1}`, pastedData[index]);
//         });
  
//         // After filling all the inputs, focus on the last input field
//         inputs[inputs.length - 1].focus();
//         inputs[inputs.length - 1].select();
//       }
//     }
//   };
  
  

//   return (
//     <div>
//       <input
//         id={id}
//         name={id}
//         type="text"
//         className={Styles.DigitInput + " OTPInput"}
//         value={value}
//         maxLength={1}
//         // onChange={(e) => {
//         //     const inputValue = e.target.value;
//         //     if (/^\d$/.test(inputValue)) { // Allow only digits (0-9)
//         //       onValueChange(id, inputValue);
//         //     }
//         //   }}
//         onChange={(e) => onValueChange(id, e.target.value)}
//         onKeyUp={handleKeyUp}
//         onPaste={handlePaste}
//         title="Enter a digit"
//       />
//     </div>
//   );
// };

// export default OtpInputGroup;
import React, { useRef, useEffect } from "react";
import Styles from "../../public/assets/css/otpInput.module.css";

const OtpInputGroup = ({ setInputValues, inputValues = {} }: any) => {
  const inputRefs = useRef<any[]>([]);

  const handleInputChange = (inputId: any, value: any) => {
    setInputValues((prevInputValues: any) => ({
      ...prevInputValues,
      [inputId]: value,
    }));
  };

  return (
    <div id="OTPInputGroup" className={Styles.digitGroup} data-autosubmit="true">
      {Object.keys(inputValues).map((inputId, index) => (
        <OTPInput
          key={index}
          id={inputId}
          value={inputValues[inputId]}
          onValueChange={handleInputChange}
          inputRefs={inputRefs}
          index={index}
        />
      ))}
    </div>
  );
};

const OTPInput = ({
  id,
  value,
  onValueChange,
  inputRefs,
  index,
}: {
  id: string;
  value: string;
  onValueChange: (id: string, value: string) => void;
  inputRefs: React.MutableRefObject<any[]>;
  index: number;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRefs.current[index] = inputRef.current;
  }, [index, inputRefs]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" || e.key === "ArrowLeft") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (
      e.key === "ArrowRight" ||
      (/^\d$/.test(e.key) && index < inputRefs.current.length - 1)
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, inputRefs.current.length);

    pastedData.split("").forEach((char, i) => {
      const input = inputRefs.current[i];
      if (input) {
        input.value = char;
        onValueChange(`input${i + 1}`, char);
      }
    });

    // Focus and select the last input field
    const lastInput = inputRefs.current[pastedData.length - 1];
    lastInput?.focus();
    lastInput?.select();
  };

  return (
    <div>
      <input
        id={id}
        name={id}
        type="text"
        className={`${Styles.DigitInput} OTPInput`}
        value={value}
        maxLength={1}
        onChange={(e) => onValueChange(id, e.target.value)}
        onKeyUp={handleKeyUp}
        onPaste={handlePaste}
        ref={inputRef}
        title="Enter a digit"
      />
    </div>
  );
};

export default OtpInputGroup;
