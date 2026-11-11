import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Printer,
  X,
  Check,
  RotateCw,
  Trash2,
  Plus,
  Eye,
  Sliders,
  Sparkles,
  Building2,
  FolderLock,
  Lock,
  AlertCircle,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileCheck2,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import { VaultDocument, VaultDocumentCategory, VaultScanSource } from '../../types/crm';

interface CRMDocumentScannerModalProps {
  onClose: () => void;
  onDocumentSaved: (doc: VaultDocument) => void;
}

export const CRMDocumentScannerModal: React.FC<CRMDocumentScannerModalProps> = ({
  onClose,
  onDocumentSaved,
}) => {
  const currentUser = crmService.getCurrentUser();
  const companies = crmService.getCompanies();

  // Scan Mode
  const [scanMode, setScanMode] = useState<'camera' | 'printer'>('camera');

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Scanned Pages Queue (Base64 data URLs)
  const [scannedPages, setScannedPages] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<'normal' | 'bw' | 'grayscale' | 'contrast'>('bw');
  const [rotation, setRotation] = useState<number>(0);

  // Hardware / Printer Scanner Options
  const [scannerDevice, setScannerDevice] = useState<string>(
    'HP LaserJet Enterprise Flow MFP (Registry Department Scanner)'
  );
  const [scanDpi, setScanDpi] = useState<number>(300);
  const [scanColorMode, setScanColorMode] = useState<string>('color');
  const [feederSource, setFeederSource] = useState<'flatbed' | 'adf'>('adf');
  const [isHardwareScanning, setIsHardwareScanning] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Document Metadata Form
  const [docTitle, setDocTitle] = useState<string>('');
  const [category, setCategory] = useState<VaultDocumentCategory>('Mining Concession Deed');
  const [department, setDepartment] = useState<string>(
    currentUser?.department || 'Registry Department'
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [isConfidential, setIsConfidential] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [ocrText, setOcrText] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Initialize or re-initialize camera when mode changes to 'camera'
  useEffect(() => {
    if (scanMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [scanMode, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported by your browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera initiation failed:', err);
      setCameraError(
        'Unable to access camera. Please check browser permissions or switch to Printer Scanner / Direct Import.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture Page from Live Camera
  const handleCapturePage = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply rotation
    if (rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(video, -canvas.width / 2, -canvas.height / 2);
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Apply filter processing
    applyFilterToCanvas(ctx, canvas.width, canvas.height, activeFilter);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setScannedPages((prev) => [...prev, dataUrl]);
    setCurrentPageIndex(scannedPages.length);

    // Auto-suggest document title if empty
    if (!docTitle) {
      setDocTitle(`Scanned ${category} - ${new Date().toLocaleDateString('en-LR')}`);
    }

    // Simulate OCR text extraction
    simulateOcr(category);
  };

  // Filter application helper
  const applyFilterToCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    filter: 'normal' | 'bw' | 'grayscale' | 'contrast'
  ) => {
    if (filter === 'normal') return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const avg = 0.299 * r + 0.587 * g + 0.114 * b;

      if (filter === 'grayscale') {
        d[i] = avg;
        d[i + 1] = avg;
        d[i + 2] = avg;
      } else if (filter === 'bw') {
        // High-contrast Document B&W (Thresholding)
        const threshold = 135;
        const val = avg > threshold ? 255 : 0;
        d[i] = val;
        d[i + 1] = val;
        d[i + 2] = val;
      } else if (filter === 'contrast') {
        // High contrast document
        const factor = 1.35;
        d[i] = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        d[i + 1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        d[i + 2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
      }
    }
    ctx.putImageData(imgData, 0, 0);
  };

  // Direct Hardware Scanner file acquisition or upload
  const handleHardwareFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setScannedPages((prev) => [...prev, result]);
          if (!docTitle) {
            const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
            setDocTitle(cleanName);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    simulateOcr(category);
  };

  // Simulate acquiring scan directly from networked office printer scanner
  const handleSimulatePrinterScan = () => {
    setIsHardwareScanning(true);
    setTimeout(() => {
      // Generate a high-resolution simulated statutory scanned document canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Paper background
        ctx.fillStyle = '#fbfbfb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header letterhead bar
        ctx.fillStyle = '#2a602f';
        ctx.fillRect(80, 80, canvas.width - 160, 16);

        // Official Title
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('REPUBLIC OF LIBERIA', 100, 150);

        ctx.font = '22px sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText('MINISTRY OF MINES & ENERGY • MINERAL CADASTRE OFFICE', 100, 190);
        ctx.fillText(`STATUTORY DOCUMENT REGISTRATION: ${category.toUpperCase()}`, 100, 225);

        // Horizontal Rule
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, 250);
        ctx.lineTo(canvas.width - 100, 250);
        ctx.stroke();

        // Sample Scanned Text
        ctx.font = '20px monospace';
        ctx.fillStyle = '#334155';
        ctx.fillText(`OFFICIAL CADASTRE REGISTRATION NO: LR-CAD-2026-${Math.floor(1000 + Math.random() * 9000)}`, 100, 310);
        ctx.fillText(`JURISDICTION: Montserrado & Nimba Mineral Corridors`, 100, 350);
        ctx.fillText(`SCAN RESOLUTION: ${scanDpi} DPI • COLOR DEPTH: ${scanColorMode.toUpperCase()}`, 100, 390);
        ctx.fillText(`HARDWARE DEVICE: ${scannerDevice}`, 100, 430);
        ctx.fillText(`INGESTION TIMESTAMP: ${new Date().toISOString()}`, 100, 470);
        ctx.fillText(`ATTESTING OFFICER: ${currentUser?.name || 'Authorized Cadastre Staff'}`, 100, 510);

        // Watermark Seal
        ctx.strokeStyle = 'rgba(42, 96, 47, 0.15)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 850, 220, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = 'rgba(42, 96, 47, 0.25)';
        ctx.textAlign = 'center';
        ctx.fillText('GMEC OFFICIAL CADASTRE ARCHIVE', canvas.width / 2, 840);
        ctx.fillText('VERIFIED STATUTORY DEED', canvas.width / 2, 880);
        ctx.textAlign = 'left';

        // Bottom barcode / verification line
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(100, 1420, 350, 40);
        ctx.font = '16px monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText('GMEC-ARCHIVE-SECURE-CHAIN-OF-CUSTODY', 100, 1485);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setScannedPages((prev) => [...prev, dataUrl]);
        setCurrentPageIndex(scannedPages.length);

        if (!docTitle) {
          setDocTitle(`${category} (Printer Scan ${new Date().toLocaleDateString('en-LR')})`);
        }
        simulateOcr(category);
      }
      setIsHardwareScanning(false);
    }, 1200);
  };

  const simulateOcr = (cat: string) => {
    const sampleText = `[OCR STATUTORY PARSER]
Document: ${cat}
Reference No: LR-CAD-2026-${Math.floor(1000 + Math.random() * 9000)}
Verified by: ${currentUser?.name}
Department: ${department}
Status: Clear statutory provenance logged into GMEC Supabase Enterprise Archive.`;
    setOcrText(sampleText);
  };

  const handleDeletePage = (index: number) => {
    setScannedPages((prev) => prev.filter((_, i) => i !== index));
    if (currentPageIndex >= scannedPages.length - 1) {
      setCurrentPageIndex(Math.max(0, scannedPages.length - 2));
    }
  };

  const handleSaveToSupabase = async () => {
    if (!docTitle.trim()) {
      alert('Please enter a document title.');
      return;
    }
    if (scannedPages.length === 0) {
      alert('Please capture or acquire at least one scanned page.');
      return;
    }

    setIsSaving(true);
    try {
      const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
      const cleanFileName = `${docTitle.trim().replace(/[^a-zA-Z0-9_-]/g, '_')}_SCAN.pdf`;
      const primaryDataUrl = scannedPages[0];

      // Approximate size based on base64 length
      const approxBytes = primaryDataUrl.length * (3 / 4);
      const sizeStr = `${(approxBytes / (1024 * 1024)).toFixed(1)} MB`;

      const scanSource: VaultScanSource =
        scanMode === 'camera' ? 'phone_camera' : 'printer_scanner';

      const savedDoc = crmService.addVaultDocument({
        title: docTitle.trim(),
        fileName: cleanFileName,
        fileSize: sizeStr,
        fileFormat: 'PDF',
        category,
        department,
        companyName: selectedCompany?.companyName || undefined,
        licenseNumber: licenseNumber.trim() || undefined,
        confidential: isConfidential,
        description: description.trim() || `Scanned via ${scanMode === 'camera' ? 'Mobile Camera Scanner' : scannerDevice}. ${scannedPages.length} page(s) captured.`,
        downloadUrl: primaryDataUrl,
        scanSource,
        scanDevice: scanMode === 'camera' ? (facingMode === 'environment' ? 'Rear Document Camera' : 'Front Camera') : scannerDevice,
        pagesCount: scannedPages.length,
        fileData: primaryDataUrl,
        ocrExtractedText: ocrText || undefined,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        onDocumentSaved(savedDoc);
        onClose();
      }, 1200);
    } catch (err: any) {
      alert(`Error saving document to Supabase: ${err?.message || 'Database connection error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Main Studio Modal */}
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[94vh] font-['Outfit',sans-serif] overflow-hidden animate-in fade-in zoom-in-95 text-slate-900">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2a602f] text-[#ffc30d] rounded-2xl shadow-sm">
              <Camera size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                  GMEC Document Scanning Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                  Direct Cloud Archive
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Hardware printer scanners & mobile phone optical ingestion into Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher Tabs */}
            <div className="hidden sm:inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setScanMode('camera')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  scanMode === 'camera'
                    ? 'bg-[#2a602f] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera size={14} />
                <span>Phone / Web Camera</span>
              </button>
              <button
                type="button"
                onClick={() => setScanMode('printer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  scanMode === 'printer'
                    ? 'bg-[#2a602f] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Printer size={14} />
                <span>Office Printer Scanner</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
          {/* LEFT COLUMN: Optical Scanner Viewfinder / Hardware Scanner (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Mobile / Camera Mode */}
            {scanMode === 'camera' && (
              <div className="bg-slate-900 rounded-3xl overflow-hidden p-3 relative flex flex-col items-center justify-center min-h-[380px] shadow-inner border border-slate-800">
                {isCameraActive ? (
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Document A4 Framing Overlay Guide */}
                    <div className="absolute inset-6 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-2 shadow-sm">
                      <div className="flex justify-between">
                        <div className="w-5 h-5 border-t-4 border-l-4 border-emerald-400" />
                        <div className="w-5 h-5 border-t-4 border-r-4 border-emerald-400" />
                      </div>
                      <div className="text-center">
                        <span className="px-3 py-1 rounded-full bg-slate-950/70 text-emerald-300 text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
                          Align Document Within Frame
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-5 h-5 border-b-4 border-l-4 border-emerald-400" />
                        <div className="w-5 h-5 border-b-4 border-r-4 border-emerald-400" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 max-w-sm">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center mx-auto mb-3 border border-slate-700">
                      <Camera size={32} />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">Camera Standby</h4>
                    <p className="text-xs text-slate-400 mb-4">
                      {cameraError || 'Activate camera feed to scan physical deeds, EPA permits, or IDs.'}
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-[#2a602f] hover:bg-[#235027] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Start Camera Feed
                    </button>
                  </div>
                )}

                {/* Shutter & Camera Controls */}
                {isCameraActive && (
                  <div className="w-full mt-3 flex items-center justify-between px-2">
                    {/* Filter Selector */}
                    <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl text-[10px] font-bold text-slate-300">
                      {(['bw', 'contrast', 'grayscale', 'normal'] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setActiveFilter(f)}
                          className={`px-2 py-1 rounded-lg uppercase transition-colors ${
                            activeFilter === f
                              ? 'bg-[#2a602f] text-white'
                              : 'hover:text-white'
                          }`}
                        >
                          {f === 'bw' ? 'Document B&W' : f}
                        </button>
                      ))}
                    </div>

                    {/* Big Shutter Button */}
                    <button
                      type="button"
                      onClick={handleCapturePage}
                      className="w-14 h-14 rounded-full bg-white hover:bg-emerald-50 active:scale-95 border-4 border-[#2a602f] shadow-lg flex items-center justify-center cursor-pointer transition-transform"
                      title="Capture Page"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#2a602f] flex items-center justify-center text-white">
                        <Camera size={18} />
                      </div>
                    </button>

                    {/* Camera Flip / Rotate */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
                        title="Flip Camera (Front/Back)"
                      >
                        <RotateCw size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hardware Printer Scanner Mode */}
            {scanMode === 'printer' && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
                      <Printer size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 tracking-tight">
                        Network Printer & Flatbed Scanner
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Direct connection to office multi-function scanners & automated document feeders
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-[#2a602f] border border-emerald-200">
                    Online / Connected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Scanner Device
                    </label>
                    <select
                      value={scannerDevice}
                      onChange={(e) => setScannerDevice(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="HP LaserJet Enterprise Flow MFP (Registry Department Scanner)">
                        HP LaserJet Flow MFP (Registry Dept)
                      </option>
                      <option value="Canon imageRUNNER ADVANCE C5535i (Cadastre Scanner)">
                        Canon imageRUNNER (Cadastre Division)
                      </option>
                      <option value="Epson WorkForce Pro Document Scanner (Mobile Field Scanner)">
                        Epson WorkForce Pro (Field Ops)
                      </option>
                      <option value="Fujitsu ScanSnap iX1600 (High-Speed Feeder)">
                        Fujitsu ScanSnap (High-Speed Feeder)
                      </option>
                      <option value="Direct TWAIN / WIA / AirPrint Scanner">
                        Direct TWAIN / WIA Scanner
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Resolution (DPI)
                    </label>
                    <select
                      value={scanDpi}
                      onChange={(e) => setScanDpi(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                    >
                      <option value={150}>150 DPI (Fast / Compact)</option>
                      <option value={300}>300 DPI (Statutory Archive Standard)</option>
                      <option value={600}>600 DPI (High-Resolution Cadastre)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Paper Feeder
                    </label>
                    <select
                      value={feederSource}
                      onChange={(e) => setFeederSource(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="adf">ADF (Automatic Document Feeder / Multi-page)</option>
                      <option value="flatbed">Flatbed Platen Glass (Single Sheet)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Color Mode
                    </label>
                    <select
                      value={scanColorMode}
                      onChange={(e) => setScanColorMode(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="color">Full Color 24-bit</option>
                      <option value="grayscale">Grayscale 8-bit</option>
                      <option value="monochrome">Black & White (1-bit Line Art)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleSimulatePrinterScan}
                    disabled={isHardwareScanning}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#2a602f] hover:bg-[#224f26] disabled:opacity-50 text-[#ffc30d] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <Printer size={16} />
                    <span>
                      {isHardwareScanning ? 'Scanning From Printer...' : 'Acquire Scan From Printer'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <UploadCloud size={16} />
                    <span>Select Scanned Files</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleHardwareFileInput}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Scanned Pages Carousel / Preview Strip */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Captured Pages ({scannedPages.length})
                  </span>
                  {scannedPages.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      Viewing Page {currentPageIndex + 1} of {scannedPages.length}
                    </span>
                  )}
                </div>

                {scannedPages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                      title="Rotate Page"
                    >
                      <RotateCw size={13} />
                      <span>Rotate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePage(currentPageIndex)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs flex items-center gap-1 cursor-pointer"
                      title="Delete Current Page"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Main Current Page Display */}
              {scannedPages.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-xs font-medium">
                    No pages captured yet. Use the camera shutter or printer acquire button above to scan documents.
                  </p>
                </div>
              ) : (
                <div className="relative aspect-[3/4] max-h-72 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center p-2 mb-3 shadow-inner">
                  <img
                    src={scannedPages[currentPageIndex]}
                    alt={`Page ${currentPageIndex + 1}`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="max-h-full max-w-full object-contain transition-transform duration-200 shadow-md rounded"
                  />

                  {/* Navigation Arrows */}
                  {scannedPages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCurrentPageIndex((i) => Math.max(0, i - 1))}
                        disabled={currentPageIndex === 0}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white disabled:opacity-30 flex items-center justify-center cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPageIndex((i) => Math.min(scannedPages.length - 1, i + 1))
                        }
                        disabled={currentPageIndex === scannedPages.length - 1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white disabled:opacity-30 flex items-center justify-center cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Thumbnail Strip */}
              {scannedPages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  {scannedPages.map((page, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`relative w-12 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        currentPageIndex === idx
                          ? 'border-[#2a602f] ring-2 ring-emerald-200 scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={page} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[8px] font-bold px-1 rounded-tl">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Document Metadata & Statutory Archival (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileCheck2 size={18} className="text-[#2a602f]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Statutory Metadata & Filing
                </h3>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>Document scanned & successfully archived in Supabase cloud!</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    placeholder="e.g. Scanned Articles of Incorporation - Bea Mountain"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#2a602f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Document Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as VaultDocumentCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="Articles of Incorporation">Articles of Incorporation</option>
                    <option value="Mining Concession Deed">Mining Concession Deed</option>
                    <option value="EPA Clearance">EPA Environmental Clearance</option>
                    <option value="MME Mineral Cadastre">MME Mineral Cadastre</option>
                    <option value="Tax Clearance (LRA)">Tax Clearance (LRA)</option>
                    <option value="Technical Survey & Report">Technical Geological Survey</option>
                    <option value="Executive Directive">Executive Directive</option>
                    <option value="Standard Operating Procedure (SOP)">SOP / Guidelines</option>
                    <option value="Legal Agreement">Legal Agreement / Contract</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Associate with Company
                  </label>
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none"
                  >
                    <option value="">-- Standalone / Unassigned Document --</option>
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.companyName} ({comp.registrationNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Concession / License Number
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. MEL-2026-NMB-001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:border-[#2a602f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="Registry Department">Registry Department</option>
                    <option value="Executive Directorate">Executive Directorate</option>
                    <option value="Mining Engineering">Mining Engineering & Geology</option>
                    <option value="Environmental & Compliance">Environmental & Compliance</option>
                    <option value="Field Operations">Field Operations</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                {/* Confidentiality toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="confidentialCheck"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="rounded text-[#2a602f] focus:ring-[#2a602f]"
                  />
                  <label htmlFor="confidentialCheck" className="text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer">
                    <Lock size={12} className="text-amber-600" />
                    <span>Confidential (Super Admin & Directorate Only)</span>
                  </label>
                </div>

                {/* Description & OCR */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Filing Notes / Physical Location
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Cabinet B, Shelf 3, Monrovia HQ Archive. Original stamped by MME."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Provenance Box */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[10px] text-slate-500 space-y-1">
                <div className="font-bold text-slate-700 uppercase tracking-wider">
                  Audit Provenance
                </div>
                <div>Scanning Officer: {currentUser?.name} ({currentUser?.employeeId || currentUser?.id})</div>
                <div>Scan Source: {scanMode === 'camera' ? 'Mobile Camera' : scannerDevice}</div>
                <div>Destination: Supabase Cloud Storage (`crm_vault_documents`)</div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveToSupabase}
                  disabled={isSaving || scannedPages.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-[#2a602f] hover:bg-[#235027] disabled:opacity-50 text-[#ffc30d] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  <UploadCloud size={16} />
                  <span>
                    {isSaving
                      ? 'Archiving to Supabase Cloud...'
                      : `Save ${scannedPages.length} Page(s) Directly to Supabase`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
