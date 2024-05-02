import React from 'react';

const EmailVerificationSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl text-blue-600 font-semibold mb-6">Email Verification Success</h2>
        <p className="text-gray-800 mb-6">Congratulations! Your email has been successfully verified.</p>
        <p className="text-gray-800 mb-6">If you did not sign up for an account, you can safely ignore this email.</p>
        <a href="https://example.com/dashboard" className="block w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-center font-semibold hover:bg-blue-600 transition duration-300 mb-6">Login to Your Account</a>
        <p className="text-gray-600 text-sm">Best regards,<br />better call us<br />Amine</p>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;
