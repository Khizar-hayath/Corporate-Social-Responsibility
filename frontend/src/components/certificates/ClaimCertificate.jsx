import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiLoader, FiAward, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { certificateAPI } from '../../services/api';
import jsPDF from 'jspdf';

function ClaimCertificate({ projectId, projectTitle }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!code.trim() || code.length !== 5) {
      setError('Please enter a valid 5-character code');
      return;
    }
    
    try {
      setLoading(true);
      
      // Validate the certificate code
      const validationResponse = await certificateAPI.validate(code, projectId, name);
      
      if (validationResponse.data.valid) {
        // If valid, claim the certificate
        const claimResponse = await certificateAPI.claim(code, projectId, name);
        
        if (claimResponse.data.success) {
          setSuccess(true);
          setCertificateData(claimResponse.data.certificate);
        }
      }
    } catch (err) {
      console.error('Error claiming certificate:', err);
      setError(err.response?.data?.message || 'Failed to validate certificate code');
    } finally {
      setLoading(false);
    }
  };

  // Generate and download certificate PDF
  const downloadCertificate = () => {
    if (!certificateData) return;
    
    const generatePDF = () => {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add background color/styling
      doc.setFillColor(240, 240, 250);
      doc.rect(0, 0, 297, 210, 'F');
      
      // Add border
      doc.setDrawColor(70, 80, 170);
      doc.setLineWidth(1);
      doc.rect(10, 10, 277, 190);
      
      // Certificate title
      doc.setFontSize(30);
      doc.setTextColor(50, 50, 120);
      doc.setFont('helvetica', 'bold');
      doc.text('Certificate of Participation', 148.5, 40, { align: 'center' });
      
      // Decorative line
      doc.setLineWidth(0.5);
      doc.line(74, 45, 223, 45);
      
      // Certificate text
      doc.setFontSize(16);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.text('This is to certify that', 148.5, 70, { align: 'center' });
      
      // Name
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 90);
      doc.text(certificateData.name, 148.5, 85, { align: 'center' });
      
      // Rest of text
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text('has actively participated in the', 148.5, 100, { align: 'center' });
      
      // Project title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 90);
      doc.text(certificateData.projectTitle, 148.5, 115, { align: 'center' });
      
      // Organization
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(`organized under ${certificateData.projectOrganization}`, 148.5, 130, { align: 'center' });
      
      // Date and signature
      doc.setFontSize(14);
      doc.text(`Date: ${certificateData.date}`, 60, 170);
      doc.text('Certificate Code:', 200, 170);
      doc.setFont('helvetica', 'bold');
      doc.text(certificateData.code, 237, 170);
      
      // Digital signature placeholder
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.text('Digital Signature', 237, 180);
      
      // Download the PDF
      doc.save(`${certificateData.name}-${certificateData.projectTitle}-Certificate.pdf`);
    };
    
    generatePDF();
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 mb-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-4">
        <FiAward className="mr-2 text-primary-600" />
        Claim Your Certificate
      </h2>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        If you participated in this project, enter your name and the 5-character code provided to you to claim your certificate.
      </p>
      
      <AnimatePresence>
        {!success ? (
          <motion.form 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-5 py-4 border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Certificate Code (5 characters)
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().substring(0, 5))}
                placeholder="Enter your 5-character code"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase"
                maxLength={5}
                disabled={loading}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-full btn-sm"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Validating...
                </>
              ) : (
                'Validate & Claim Certificate'
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 text-green-600">
              <FiCheck size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Certificate Validated!
            </h3>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Congratulations, {certificateData?.name}! Your certificate for 
              <span className="font-semibold"> {certificateData?.projectTitle} </span>
              is ready to download.
            </p>
            
            <button
              onClick={downloadCertificate}
              className="inline-flex items-center px-8 py-4 text-sm font-medium bg-primary-600 text-white border border-primary-600 hover:bg-primary-700"
            >
              <FiDownload className="mr-2" />
              Download Certificate
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ClaimCertificate; 