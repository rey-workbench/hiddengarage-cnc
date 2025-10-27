'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useSettings } from '@/contexts/settings-context';
import { useUI } from '@/contexts/ui-context';
import { TRANSLATIONS } from '@/lib/constants';

interface ImageTabProps {
  onGCodeGenerated: (gcode: string) => void;
}

type WorkflowStep = 'upload' | 'setup' | 'strategy' | 'parameters' | 'generate';
type MachiningStrategy = 'contour' | 'pocket' | 'engrave';

interface SetupConfig {
  stockWidth: number;
  stockHeight: number;
  stockThickness: number;
  originX: 'left' | 'center' | 'right';
  originY: 'top' | 'center' | 'bottom';
}

interface ToolConfig {
  diameter: number;
  passingDepth: number;
  finalDepth: number;
  safeZ: number;
}

interface MachiningConfig {
  feedRate: number;
  plungeRate: number;
  spindleSpeed: number;
  stepover: number;
}

export default function ImageTab({ onGCodeGenerated }: ImageTabProps) {
  const { settings } = useSettings();
  const { showSuccess, showError, showInfo } = useUI();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<MachiningStrategy>('contour');
  
  const [setupConfig, setSetupConfig] = useState<SetupConfig>({
    stockWidth: 100,
    stockHeight: 100,
    stockThickness: 10,
    originX: 'left',
    originY: 'top',
  });

  const [toolConfig, setToolConfig] = useState<ToolConfig>({
    diameter: 3,
    passingDepth: 1,
    finalDepth: 2,
    safeZ: 5,
  });

  const [machiningConfig, setMachiningConfig] = useState<MachiningConfig>({
    feedRate: 600,
    plungeRate: 300,
    spindleSpeed: 12000,
    stepover: 50,
  });

  const t = TRANSLATIONS[settings.language];

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showError('Please select a valid image file');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        showSuccess(`Image loaded: ${file.name}`);
        setCurrentStep('setup');
      };
      reader.readAsDataURL(file);
    }
  };

  const steps = [
    { id: 'upload', label: '1. Upload', icon: 'fa-upload' },
    { id: 'setup', label: '2. Setup', icon: 'fa-ruler-combined' },
    { id: 'strategy', label: '3. Strategy', icon: 'fa-route' },
    { id: 'parameters', label: '4. Parameters', icon: 'fa-sliders-h' },
    { id: 'generate', label: '5. Generate', icon: 'fa-cogs' },
  ];

  const getStepIndex = (step: WorkflowStep) => steps.findIndex(s => s.id === step);

  const renderUploadStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-4">
          <i className="fas fa-image text-6xl text-dark-600 mb-4" />
        </div>
        <h3 className="text-sm font-semibold text-gray-100 mb-2">
          {settings.language === 'id' ? 'Pilih Gambar' : 'Select Image'}
        </h3>
        <p className="text-xs text-dark-400 mb-4">
          {settings.language === 'id' 
            ? 'Upload gambar JPG, PNG, atau BMP untuk dikonversi ke G-Code'
            : 'Upload JPG, PNG, or BMP image to convert to G-Code'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <i className="fas fa-folder-open text-xs" />
          <span>{settings.language === 'id' ? 'Pilih Gambar' : 'Choose Image'}</span>
        </button>
      </div>

      {imagePreview && (
        <div className="mt-4 p-3 bg-dark-800/60 rounded-lg">
          <img src={imagePreview} alt="Preview" className="w-full h-auto rounded" />
        </div>
      )}
    </div>
  );

  const renderSetupStep = () => (
    <div className="space-y-4">
      <div className="p-3 bg-primary-500/10 border-l-2 border-primary-500 rounded text-xs text-dark-300">
        <i className="fas fa-info-circle mr-1" />
        {settings.language === 'id' 
          ? 'Atur dimensi material dan posisi origin seperti di Fusion 360'
          : 'Configure material dimensions and origin position like in Fusion 360'}
      </div>

      <div>
        <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          {settings.language === 'id' ? 'Dimensi Material (Stock)' : 'Stock Dimensions'}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">
              {settings.language === 'id' ? 'Lebar (Width)' : 'Width'} (mm)
            </label>
            <input
              type="number"
              value={setupConfig.stockWidth}
              onChange={(e) => setSetupConfig({ ...setupConfig, stockWidth: parseFloat(e.target.value) })}
              className="input-base w-24"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">
              {settings.language === 'id' ? 'Tinggi (Height)' : 'Height'} (mm)
            </label>
            <input
              type="number"
              value={setupConfig.stockHeight}
              onChange={(e) => setSetupConfig({ ...setupConfig, stockHeight: parseFloat(e.target.value) })}
              className="input-base w-24"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">
              {settings.language === 'id' ? 'Ketebalan (Thickness)' : 'Thickness'} (mm)
            </label>
            <input
              type="number"
              value={setupConfig.stockThickness}
              onChange={(e) => setSetupConfig({ ...setupConfig, stockThickness: parseFloat(e.target.value) })}
              className="input-base w-24"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          {settings.language === 'id' ? 'Work Coordinate System (WCS)' : 'Work Coordinate System'}
        </h4>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {(['left', 'center', 'right'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setSetupConfig({ ...setupConfig, originX: pos })}
              className={`btn text-xs ${setupConfig.originX === pos ? 'btn-primary' : ''}`}
            >
              {pos.charAt(0).toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['top', 'center', 'bottom'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setSetupConfig({ ...setupConfig, originY: pos })}
              className={`btn text-xs ${setupConfig.originY === pos ? 'btn-primary' : ''}`}
            >
              {pos.charAt(0).toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setCurrentStep('strategy')}
        className="btn btn-success w-full"
      >
        {settings.language === 'id' ? 'Lanjut ke Strategy' : 'Continue to Strategy'}
        <i className="fas fa-arrow-right ml-2 text-xs" />
      </button>
    </div>
  );

  const renderStrategyStep = () => (
    <div className="space-y-4">
      <div className="p-3 bg-primary-500/10 border-l-2 border-primary-500 rounded text-xs text-dark-300">
        <i className="fas fa-info-circle mr-1" />
        {settings.language === 'id' 
          ? 'Pilih strategi machining seperti di Fusion 360 CAM'
          : 'Choose machining strategy like in Fusion 360 CAM'}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setStrategy('contour')}
          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
            strategy === 'contour' 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-dark-700 bg-dark-800/40 hover:border-dark-600'
          }`}
        >
          <div className="flex items-start gap-3">
            <i className="fas fa-draw-polygon text-xl text-primary-400 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-100 mb-1">
                {settings.language === 'id' ? '2D Contour (Garis Luar)' : '2D Contour (Outline)'}
              </div>
              <div className="text-xs text-dark-300">
                {settings.language === 'id' 
                  ? 'Potong mengikuti garis tepi gambar. Cocok untuk cutting shapes.'
                  : 'Cut along the edges of the image. Good for cutting shapes.'}
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setStrategy('pocket')}
          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
            strategy === 'pocket' 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-dark-700 bg-dark-800/40 hover:border-dark-600'
          }`}
        >
          <div className="flex items-start gap-3">
            <i className="fas fa-fill-drip text-xl text-primary-400 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-100 mb-1">
                {settings.language === 'id' ? '2D Pocket (Isi Area)' : '2D Pocket (Fill Area)'}
              </div>
              <div className="text-xs text-dark-300">
                {settings.language === 'id' 
                  ? 'Isi area tertutup dengan toolpath zigzag. Cocok untuk clearing.'
                  : 'Fill closed areas with zigzag toolpath. Good for material removal.'}
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setStrategy('engrave')}
          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
            strategy === 'engrave' 
              ? 'border-primary-500 bg-primary-500/10' 
              : 'border-dark-700 bg-dark-800/40 hover:border-dark-600'
          }`}
        >
          <div className="flex items-start gap-3">
            <i className="fas fa-pen-nib text-xl text-primary-400 mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-100 mb-1">
                {settings.language === 'id' ? 'Engrave (Ukir)' : 'Engrave (Trace)'}
              </div>
              <div className="text-xs text-dark-300">
                {settings.language === 'id' 
                  ? 'Ukir mengikuti setiap garis pada gambar. Cocok untuk detail.'
                  : 'Trace every line in the image. Good for detailed engraving.'}
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep('setup')}
          className="btn flex-1"
        >
          <i className="fas fa-arrow-left mr-2 text-xs" />
          {settings.language === 'id' ? 'Kembali' : 'Back'}
        </button>
        <button
          onClick={() => setCurrentStep('parameters')}
          className="btn btn-success flex-1"
        >
          {settings.language === 'id' ? 'Lanjut ke Parameters' : 'Continue to Parameters'}
          <i className="fas fa-arrow-right ml-2 text-xs" />
        </button>
      </div>
    </div>
  );

  const renderParametersStep = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          {settings.language === 'id' ? 'Tool Configuration' : 'Tool Configuration'}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">
              {settings.language === 'id' ? 'Diameter Bit' : 'Bit Diameter'} (mm)
            </label>
            <input
              type="number"
              value={toolConfig.diameter}
              onChange={(e) => setToolConfig({ ...toolConfig, diameter: parseFloat(e.target.value) })}
              className="input-base w-20"
              step="0.1"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">
              {settings.language === 'id' ? 'Kedalaman Per Pass' : 'Passing Depth'} (mm)
            </label>
            <input
              type="number"
              value={toolConfig.passingDepth}
              onChange={(e) => setToolConfig({ ...toolConfig, passingDepth: parseFloat(e.target.value) })}
              className="input-base w-20"
              step="0.1"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">
              {settings.language === 'id' ? 'Kedalaman Akhir' : 'Final Depth'} (mm)
            </label>
            <input
              type="number"
              value={toolConfig.finalDepth}
              onChange={(e) => setToolConfig({ ...toolConfig, finalDepth: parseFloat(e.target.value) })}
              className="input-base w-20"
              step="0.1"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">Safe Z (mm)</label>
            <input
              type="number"
              value={toolConfig.safeZ}
              onChange={(e) => setToolConfig({ ...toolConfig, safeZ: parseFloat(e.target.value) })}
              className="input-base w-20"
              step="0.5"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          {settings.language === 'id' ? 'Feeds & Speeds' : 'Feeds & Speeds'}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">
              Feed Rate (mm/min)
            </label>
            <input
              type="number"
              value={machiningConfig.feedRate}
              onChange={(e) => setMachiningConfig({ ...machiningConfig, feedRate: parseInt(e.target.value) })}
              className="input-base w-24"
              step="50"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">
              Plunge Rate (mm/min)
            </label>
            <input
              type="number"
              value={machiningConfig.plungeRate}
              onChange={(e) => setMachiningConfig({ ...machiningConfig, plungeRate: parseInt(e.target.value) })}
              className="input-base w-24"
              step="50"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-dark-300">
              Spindle Speed (RPM)
            </label>
            <input
              type="number"
              value={machiningConfig.spindleSpeed}
              onChange={(e) => setMachiningConfig({ ...machiningConfig, spindleSpeed: parseInt(e.target.value) })}
              className="input-base w-24"
              step="1000"
            />
          </div>
          {strategy === 'pocket' && (
            <div className="flex items-center justify-between">
              <label className="text-sm text-dark-300">
                Stepover (%)
              </label>
              <input
                type="number"
                value={machiningConfig.stepover}
                onChange={(e) => setMachiningConfig({ ...machiningConfig, stepover: parseInt(e.target.value) })}
                className="input-base w-20"
                min="10"
                max="100"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep('strategy')}
          className="btn flex-1"
        >
          <i className="fas fa-arrow-left mr-2 text-xs" />
          {settings.language === 'id' ? 'Kembali' : 'Back'}
        </button>
        <button
          onClick={() => setCurrentStep('generate')}
          className="btn btn-success flex-1"
        >
          {settings.language === 'id' ? 'Lanjut ke Generate' : 'Continue to Generate'}
          <i className="fas fa-arrow-right ml-2 text-xs" />
        </button>
      </div>
    </div>
  );

  const handleGenerateGCode = async () => {
    if (!selectedImage) {
      showError('No image selected');
      return;
    }

    try {
      showInfo(settings.language === 'id' ? 'Memproses gambar...' : 'Processing image...');

      const { detectImageEdges, scaleContoursToStock } = await import('@/lib/image-processor');
      const { generateGCodeFromImage } = await import('@/lib/image-to-gcode');

      // Detect edges
      const contours = await detectImageEdges(selectedImage);
      
      if (contours.length === 0) {
        showError(settings.language === 'id' 
          ? 'Tidak ada edge terdeteksi. Coba gambar dengan kontras lebih tinggi.'
          : 'No edges detected. Try an image with higher contrast.');
        return;
      }

      showInfo(settings.language === 'id' 
        ? `Terdeteksi ${contours.length} contour. Generating G-Code...`
        : `Detected ${contours.length} contours. Generating G-Code...`);

      // Get image dimensions from canvas
      const img = new Image();
      img.src = imagePreview!;
      await new Promise((resolve) => { img.onload = resolve; });

      // Scale contours to stock
      const scaledContours = scaleContoursToStock(
        contours,
        img.width,
        img.height,
        setupConfig.stockWidth,
        setupConfig.stockHeight,
        setupConfig.originX,
        setupConfig.originY
      );

      // Generate G-code
      const gcode = generateGCodeFromImage(scaledContours, {
        strategy,
        toolDiameter: toolConfig.diameter,
        passingDepth: toolConfig.passingDepth,
        finalDepth: toolConfig.finalDepth,
        safeZ: toolConfig.safeZ,
        feedRate: machiningConfig.feedRate,
        plungeRate: machiningConfig.plungeRate,
        spindleSpeed: machiningConfig.spindleSpeed,
        stepover: machiningConfig.stepover,
      });

      showSuccess(settings.language === 'id' 
        ? `G-Code berhasil di-generate! (${gcode.split('\n').length} baris) - Switch ke tab G-Code`
        : `G-Code generated successfully! (${gcode.split('\n').length} lines) - Switching to G-Code tab`);

      // Pass to parent component and trigger switch
      onGCodeGenerated(gcode);

    } catch (error) {
      showError(settings.language === 'id' 
        ? `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        : `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const renderGenerateStep = () => (
    <div className="space-y-4">
      <div className="p-3 bg-green-500/10 border-l-2 border-green-500 rounded">
        <div className="flex items-start gap-2 mb-2">
          <i className="fas fa-check-circle text-green-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-green-400 mb-1">
              {settings.language === 'id' ? 'Setup Selesai!' : 'Setup Complete!'}
            </div>
            <div className="text-xs text-dark-300">
              {settings.language === 'id' 
                ? 'Siap untuk generate G-Code dengan konfigurasi berikut:'
                : 'Ready to generate G-Code with the following configuration:'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-800/60 rounded-lg p-3 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-dark-400">Strategy:</span>
          <span className="text-primary-400 font-semibold">{strategy.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark-400">Stock:</span>
          <span className="text-gray-100">{setupConfig.stockWidth} × {setupConfig.stockHeight} × {setupConfig.stockThickness} mm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark-400">Tool:</span>
          <span className="text-gray-100">Ø{toolConfig.diameter}mm, Depth: {toolConfig.finalDepth}mm</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark-400">Feed Rate:</span>
          <span className="text-gray-100">{machiningConfig.feedRate} mm/min</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark-400">Spindle:</span>
          <span className="text-gray-100">{machiningConfig.spindleSpeed} RPM</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep('parameters')}
          className="btn flex-1"
        >
          <i className="fas fa-arrow-left mr-2 text-xs" />
          {settings.language === 'id' ? 'Kembali' : 'Back'}
        </button>
        <button
          onClick={handleGenerateGCode}
          className="btn btn-primary flex-1"
        >
          <i className="fas fa-cogs mr-2 text-xs" />
          {settings.language === 'id' ? 'Generate G-Code' : 'Generate G-Code'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  getStepIndex(currentStep) >= index
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-dark-400'
                }`}
              >
                {getStepIndex(currentStep) > index ? (
                  <i className="fas fa-check" />
                ) : (
                  <i className={`fas ${step.icon}`} />
                )}
              </div>
              <span className="text-[10px] text-dark-400 mt-1 text-center">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 transition-all ${
                  getStepIndex(currentStep) > index ? 'bg-primary-500' : 'bg-dark-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="border border-dark-700 rounded-lg p-4">
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'setup' && renderSetupStep()}
        {currentStep === 'strategy' && renderStrategyStep()}
        {currentStep === 'parameters' && renderParametersStep()}
        {currentStep === 'generate' && renderGenerateStep()}
      </div>
    </div>
  );
}
