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
  const router = useRouter()
  const supabase = createClient()

  const addFiles = useCallback((candidateFiles: File[]) => {
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

  const onDrop = useCallback((acceptedFiles: File[]) => addFiles(acceptedFiles), [addFiles])
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/heic': [], 'image/heif': [] },
    multiple: true,
    maxSize: MAX_IMAGE_SIZE,
    onDropRejected: () => toast.error('File not accepted. Please use JPG, PNG, or WEBP images under 10 MB.'),
  })

  const onCameraChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files || []))
    event.target.value = ''
  }

  const removeImage = (id: string) => {
    setImages(currentImages => {
      const image = currentImages.find(item => item.id === id)
      if (image) URL.revokeObjectURL(image.preview)
      return currentImages.filter(item => item.id !== id)
    })
    setState('idle')
    setCurrentStep(0)
  }

  const handleAnalyze = async () => {
    if (!images.length) return
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button type="button" onClick={open} className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
        <Upload className="w-5 h-5 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-700">Upload from device</p>
        <p className="text-xs text-slate-400 mt-0.5">Select from gallery or files</p>
      </button>
      <button type="button" onClick={() => cameraInputRef.current?.click()} className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
        <Camera className="w-5 h-5 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-700">Capture with camera</p>
        <p className="text-xs text-slate-400 mt-0.5">Use your phone&apos;s rear camera</p>
      </button>
      <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
        <ImageIcon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-700">Multiple images</p>
        <p className="text-xs text-slate-400 mt-0.5">Front, back, side, top or bottom</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" multiple onChange={onCameraChange} className="hidden" />
      {images.length === 0 ? (
        <div {...getRootProps()} className={cn('relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200', isDragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50')}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center transition-colors', isDragActive ? 'bg-blue-100' : 'bg-white shadow-sm border border-slate-200')}>
              {isDragActive ? <ScanLine className="w-8 h-8 text-blue-600" /> : <Upload className="w-8 h-8 text-slate-400" />}
            </div>
            <div><p className="text-slate-700 font-semibold text-lg">Upload Product Images</p><p className="text-slate-400 text-sm mt-1">Drag &amp; drop or click to browse</p></div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white rounded-lg px-3 py-1.5 border border-slate-200"><FileImage className="w-3.5 h-3.5" />JPG, PNG, WEBP &bull; Max 10 MB each</div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img src={image.preview} alt={`Inspection image ${index + 1}`} className="w-full h-52 object-contain" />
                <button onClick={() => removeImage(image.id)} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors" aria-label={`Remove inspection image ${index + 1}`}><X className="w-4 h-4" /></button>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 border border-slate-200"><p className="text-xs text-slate-600 font-medium truncate max-w-[200px]">Image {index + 1}: {image.file.name}</p><p className="text-xs text-slate-400">{(image.file.size / 1024).toFixed(0)} KB</p></div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="outline" onClick={open} className="border-slate-300"><Plus className="w-4 h-4" />Add from device</Button>
            <Button type="button" variant="outline" onClick={() => cameraInputRef.current?.click()} className="border-slate-300"><Camera className="w-4 h-4" />Capture another</Button>
            <Button onClick={handleAnalyze} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm font-semibold h-11"><ScanLine className="w-5 h-5" />Analyze Product{images.length > 1 ? ` (${images.length} images)` : ''}</Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-blue-50 rounded-lg px-3 py-2.5 border border-blue-100"><Camera className="w-3.5 h-3.5 text-blue-500 shrink-0" /><span><strong className="text-blue-600">Tip:</strong> Add clear photos of the front, back, sides, and any panel containing declarations.</span></div>
        </>
      )}
      {images.length === 0 && addImageActions}
    </div>
  )
}
