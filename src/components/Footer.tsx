export default function Footer() {
  return (
    <footer className="py-8 border-t border-[#252A35] mt-12 bg-[#0C0E12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <p className="text-xs text-[#7A8499]">
            Connected to SEAP e-licitatie.ro — Real tender data from Romanian public procurement
          </p>
          <span className="hidden sm:inline text-[#4A5268]">|</span>
          <p className="text-[11px] text-[#4A5268]">
            Powered by: OpenSSL | pdfminer | Tesseract OCR | Claude AI
          </p>
        </div>
        <p className="text-xs text-[#7A8499] flex-shrink-0">
          Built by <span className="text-[#3B7BF5] font-medium">NextAutomation</span>
        </p>
      </div>
    </footer>
  )
}
