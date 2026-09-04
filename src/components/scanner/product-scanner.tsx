'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Upload, Camera, Image as ImageIcon, X, Loader2, ScanLine, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { analyzeProduct } from '@/services/analyzer'
import { saveScan, uploadImage } from '@/services/scans'
import { createClient } from '@/lib/supabase/client'
import { AnalysisProgress } from '@/components/scanner/analysis-progress'
import { ANALYSIS_STEPS } from '@/constants/compliance-rules'

type State = 'idle' | 'analyzing' | 'done'

export function ProductScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [state, setState] = useState<State>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setState('idle')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: () => toast.error('File not accepted. Please use JPG, PNG or WEBP under 10MB.'),
  })

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setState('idle')
    setCurrentStep(0)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setState('analyzing')
    setCurrentStep(0)

    try {
      // Step through analysis stages with realistic timing
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        setCurrentStep(i)
        await new Promise(r => setTimeout(r, ANALYSIS_STEPS[i].duration))
      }

      // Run analysis
      const result = await analyzeProduct(file, undefined)

      // Try to save to Supabase (gracefully handles no-auth case)
      const { data: { user } } = await supabase.auth.getUser()
      let scanId: string | null = null

      if (user) {
        const imageUrl = await uploadImage(file, user.id)
        scanId = await saveScan(result, imageUrl, user.id)
      }

      toast.success('Analysis complete!')

      // Navigate to report — if saved use DB id, else use session storage
      if (scanId) {
        router.push(`/reports/${scanId}`)
      } else {
        // Store result temporarily for unauthenticated demo
        sessionStorage.setItem('labelcheck_result', JSON.stringify(result))
        router.push('/reports/demo')
      }
    } catch (err) {
      console.error(err)
      toast.error('Analysis failed. Please try again.')
      setState('idle')
      setCurrentStep(0)
    }
  }

  if (state === 'analyzing') {
    return <AnalysisProgress steps={ANALYSIS_STEPS} currentStep={currentStep} />
  }

  return (
    <div className="space-y-6">
      {!file ? (
        /* Upload area */
        <div
          {...getRootProps()}
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200',
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
              isDragActive ? 'bg-blue-100' : 'bg-white shadow-sm border border-slate-200'
            )}>
              {isDragActive ? (
                <ScanLine className="w-8 h-8 text-blue-600" />
              ) : (
                <Upload className="w-8 h-8 text-slate-400" />
              )}
            </div>
            {isDragActive ? (
              <p className="text-blue-600 font-semibold">Drop your image here...</p>
            ) : (
              <>
                <div>
                  <p className="text-slate-700 font-semibold text-lg">Upload Product Image</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Drag &amp; drop or click to browse
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-white rounded-lg px-3 py-1.5 border border-slate-200">
                  <FileImage className="w-3.5 h-3.5" />
                  JPG, PNG, WEBP &bull; Max 10 MB
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Preview area */
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <img
              src={preview!}
              alt="Product preview"
              className="w-full max-h-80 object-contain"
            />
            <button
              onClick={removeFile}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 border border-slate-200">
              <p className="text-xs text-slate-600 font-medium truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAnalyze}
              className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm font-semibold h-11"
            >
              <ScanLine className="w-5 h-5" />
              Analyze Product
            </Button>
            <Button variant="outline" onClick={removeFile} className="border-slate-300">
              <X className="w-4 h-4" />
              Remove
            </Button>
          </div>

          {/* Camera tip */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-blue-50 rounded-lg px-3 py-2.5 border border-blue-100">
            <Camera className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>
              <strong className="text-blue-600">Tip:</strong> For best results, photograph all label panels — front, back and sides — and upload the clearest image.
            </span>
          </div>
        </div>
      )}

      {/* Multiple images note */}
      {!file && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Upload, label: 'Upload from device', desc: 'Select from gallery or files' },
            { icon: Camera, label: 'Capture with camera', desc: 'Use phone/webcam directly' },
            { icon: ImageIcon, label: 'Multiple images', desc: 'Upload front, back, sides' },
          ].map(item => (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer"
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            >
              <item.icon className="w-5 h-5 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
