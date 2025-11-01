import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student"); // Default role

  const handleNext = (email) => {
    if (email) setEmail(email);
    setStep(step + 1);
  };

  return (
    <div>
      {step === 1 && <ForgotPassword onNext={handleNext} setRole={setRole} />}
      {step === 2 && <VerifyOTP email={email} role={role} onNext={handleNext} />}
      {step === 3 && <ResetPassword email={email} role={role} />}
    </div>
  );
};

export default ForgotPasswordFlow;
