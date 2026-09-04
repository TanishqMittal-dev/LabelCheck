'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Upload, Camera, Image as ImageIcon, X, ScanLine, FileImage, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { analyzeProduct } from '@/services/analyzer'
import { saveScan, uploadImage } from '@/services/scans'
import { createClient } from '@/lib/supabase/client'
import { AnalysisProgress } from '@/components/scanner/analysis-progress'
import { ANALYSIS_STEPS } from '@/constants/compliance-rules'

type State = 'idle' | 'analyzing' | 'done'
type InspectionImage = { id: string; file: File; preview: string }

const MAX_IMAGES = 8
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function isHeic(file: File) {
  return file.type === 'image/heic' || file.type === 'image/heif' || /\.hei[cf]$/i.test(file.name)
}

export function ProductScanner() {
  const [images, setImages] = useState<InspectionImage[]>([])
  const [state, setState] = useState<State>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const lastCaptureTimeRef = useRef<number>(0)
  const router = useRouter()
  const supabase = createClient()

  const addFiles = useCallback((candidateFiles: File[]) => {
    lastCaptureTimeRef.current = Date.now()
    const unsupportedHeic = candidateFiles.filter(isHeic)
    const unsupportedTypes = candidateFiles.filter(file => !isHeic(file) && !SUPPORTED_IMAGE_TYPES.has(file.type))
    const oversizedFiles = candidateFiles.filter(file => file.size > MAX_IMAGE_SIZE)
    const validFiles = candidateFiles.filter(file => SUPPORTED_IMAGE_TYPES.has(file.type) && file.size <= MAX_IMAGE_SIZE)

    if (unsupportedHeic.length) toast.error('HEIC/HEIF photos are not supported yet. Please set your camera to JPG or choose a JPG, PNG, or WEBP image.')
    if (unsupportedTypes.length) toast.error('Please use JPG, PNG, or WEBP images.')
    if (oversizedFiles.length) toast.error('Each image must be smaller than 10 MB.')
    if (!validFiles.length) return

    setImages(currentImages => {
      const availableSlots = MAX_IMAGES - currentImages.length
      if (availableSlots <= 0) {
        toast.error(`You can add up to ${MAX_IMAGES} inspection images.`)
        return currentImages
      }
      const filesToAdd = validFiles.slice(0, availableSlots)
      if (filesToAdd.length < validFiles.length) toast.error(`Only the first ${availableSlots} image${availableSlots === 1 ? '' : 's'} could be added (maximum ${MAX_IMAGES}).`)
      return [...currentImages, ...filesToAdd.map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}-${index}`,
        file,
        preview: URL.createObjectURL(file),
      }))]
    })
    setState('idle')
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    lastCaptureTimeRef.current = Date.now()
    addFiles(acceptedFiles)
  }, [addFiles])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/heic': [], 'image/heif': [] },
    multiple: true,
    maxSize: MAX_IMAGE_SIZE,
    onDropRejected: () => toast.error('File not accepted. Please use JPG, PNG, or WEBP images under 10 MB.'),
  })

  const onCameraChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    lastCaptureTimeRef.current = Date.now()
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      addFiles(files)
    }
    event.target.value = ''
  }

  const handleCameraClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    cameraInputRef.current?.click()
  }

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    open()
  }

  const removeImage = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setImages(currentImages => {
      const image = currentImages.find(item => item.id === id)
      if (image) URL.revokeObjectURL(image.preview)
      return currentImages.filter(item => item.id !== id)
    })
    setState('idle')
    setCurrentStep(0)
  }

  const handleAnalyze = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    // Prevent ghost clicks from mobile camera return / layout shift
    if (Date.now() - lastCaptureTimeRef.current < 600) {
      return
    }
    if (!images.length || state === 'analyzing') return
    setState('analyzing')
    setCurrentStep(0)
    try {
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, ANALYSIS_STEPS[i].duration))
      }
      const result = await analyzeProduct(images.map(image => image.file))
      const { data: { user } } = await supabase.auth.getUser()
      let scanId: string | null = null
      if (user) {
        // The existing schema has one image_url, so retain the first image for now.
        const imageUrl = await uploadImage(images[0].file, user.id)
        scanId = await saveScan(result, imageUrl, user.id)
      }
      toast.success('Analysis complete!')
      if (scanId) router.push(`/reports/${scanId}`)
      else {
        sessionStorage.setItem('labelcheck_result', JSON.stringify(result))
        router.push('/reports/demo')
      }
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
      setState('idle')
      setCurrentStep(0)
    }
  }

  if (state === 'analyzing') return <AnalysisProgress steps={ANALYSIS_STEPS} currentStep={currentStep} />

  const addImageActions = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        type="button"
        onClick={handleUploadClick}
        className="group bg-white rounded-2xl border-2 border-slate-200 p-5 text-left hover:border-blue-500 hover:bg-blue-50/20 transition-all shadow-2xs flex items-start gap-4 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
          <Upload className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
            Upload from Device
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Browse files or photo gallery. Select multiple label angles (JPG, PNG, WEBP).
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={handleCameraClick}
        className="group bg-white rounded-2xl border-2 border-slate-200 p-5 text-left hover:border-blue-500 hover:bg-blue-50/20 transition-all shadow-2xs flex items-start gap-4 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
          <Camera className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
            Capture with Camera
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Snap photos directly with your phone or webcam. Captures high-res packaging details.
          </p>
        </div>
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={onCameraChange}
        className="hidden"
      />

      {images.length === 0 ? (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              'relative border-2 border-dashed rounded-2xl p-10 sm:p-12 text-center cursor-pointer transition-all duration-200',
              isDragActive
                ? 'border-blue-500 bg-blue-50/60'
                : 'border-slate-300 bg-slate-50/80 hover:border-blue-400 hover:bg-blue-50/30'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-2xs',
                  isDragActive ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-blue-600'
                )}
              >
                {isDragActive ? <ScanLine className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
              </div>
              <div className="space-y-1">
                <p className="text-slate-900 font-bold text-lg tracking-tight">
                  Drag &amp; drop package images here
                </p>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Or use the buttons below to upload from files or capture with camera
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white rounded-lg px-3 py-1.5 border border-slate-200 shadow-2xs mt-2">
                <FileImage className="w-3.5 h-3.5 text-blue-600" />
                Supports JPG, PNG, WEBP &bull; Max 10 MB each (Auto-optimized)
              </div>
            </div>
          </div>

          {addImageActions}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header info */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 px-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                {images.length} of {MAX_IMAGES} Package Images Selected
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Multi-panel inspection enabled
            </span>
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900/5 group shadow-2xs"
              >
                <div className="h-48 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={image.preview}
                    alt={`Inspection image ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Badge Number */}
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                  Panel {index + 1}
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => removeImage(image.id, e)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/95 backdrop-blur-xs rounded-lg flex items-center justify-center shadow-xs border border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                  aria-label={`Remove inspection image ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Metadata overlay */}
                <div className="p-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
                  <p className="text-slate-700 font-semibold truncate max-w-[150px]">
                    {image.file.name}
                  </p>
                  <span className="text-slate-400 text-[11px] font-mono">
                    {(image.file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              className="border-slate-300 hover:bg-slate-50 font-semibold h-11 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add from device
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCameraClick}
              className="border-slate-300 hover:bg-slate-50 font-semibold h-11 text-xs sm:text-sm"
            >
              <Camera className="w-4 h-4 mr-1.5" />
              Capture another panel
            </Button>
            <Button
              type="button"
              onClick={handleAnalyze}
              className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold h-11 text-sm shadow-xs text-white"
            >
              <ScanLine className="w-5 h-5 mr-2" />
              Analyze Product Compliance ({images.length} {images.length === 1 ? 'Panel' : 'Panels'})
            </Button>
          </div>

          {/* Tip banner */}
          <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-blue-50/80 rounded-xl p-3.5 border border-blue-200/80">
            <Camera className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-blue-900 font-bold">Inspection Guidance:</strong> Capturing multiple panels (Front PDP, Back Declaration Panel, Sides) ensures complete verification of Consumer Care, Manufacturer Address, Net Quantity, and Unit Sale Price.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
