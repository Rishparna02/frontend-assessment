import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, setToken, register } from "@/lib/api";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

const EmailVerification = () => {
  const [code, setCode] = useState<string[]>(Array(8).fill(""));
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email: string })?.email || "";

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 7) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const otp = code.join("");
    if (otp.length !== 6) { // OTP is 6 digits from backend
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      const data = await verifyEmail({ email, otp });
      setToken(data.token);
      navigate("/login", { state: { message: "Email verified successfully. Please log in." } });
    } catch (err: any) {
      setError(err.message || "Email verification failed.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setResendMessage("");
    try {
      // Re-register to send new OTP (this will re-use existing user if email exists)
      await register({ name: "", email, password: "" }); // Name and password are not strictly needed here for resend, but API requires them. Consider a dedicated resend endpoint.
      setResendMessage("New OTP sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-black mb-4">Verify your email</h2>
              <p className="text-gray-600 mb-2">Enter the 6 digit code you have received on</p>
              <p className="text-gray-600">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-4 block">Code</label>
                <div className="grid grid-cols-6 gap-2"> {/* Changed to 6 columns for 6-digit OTP */}
                  {code.slice(0, 6).map((digit, index) => ( // Render only 6 inputs
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
                          const prevInput = document.getElementById(`code-${index - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              {resendMessage && <div className="text-green-600 text-sm">{resendMessage}</div>}
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white py-3 text-sm font-medium"
              >
                VERIFY
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-black font-medium hover:underline text-sm"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
