import React from 'react';
import { X, Download, Print } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';

const PreviewModal = ({ isOpen, onClose, children }) => {
  const handleDownload = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto p-0">
        {/* Header with controls */}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Resume Preview</h3>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={handlePrint}
              variant="outline"
              className="border-slate-300"
            >
              <Print className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-8 bg-white">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;