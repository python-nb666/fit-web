import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { BodyModel } from './BodyModel'

interface WelcomeScreenProps {
  onComplete: (data: BodyData) => void
}

export interface BodyData {
  height: number
  weight: number
  muscle: number
  fat: number
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(0)
  const [bodyData, setBodyData] = useState<BodyData>({
    height: 170,
    weight: 70,
    muscle: 30,
    fat: 15
  })

  const handleInputChange = (field: keyof BodyData, value: string) => {
    const numValue = parseFloat(value) || 0
    setBodyData(prev => ({ ...prev, [field]: numValue }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // 保存数据到 localStorage
      localStorage.setItem('fit_body_data', JSON.stringify(bodyData))
      onComplete(bodyData)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('fit_body_data', JSON.stringify(bodyData))
    onComplete(bodyData)
  }

  const isStepValid = () => {
    switch (step) {
      case 0:
        return bodyData.height >= 140 && bodyData.height <= 220
      case 1:
        return bodyData.weight >= 40 && bodyData.weight <= 200
      case 2:
        return bodyData.muscle >= 10 && bodyData.muscle <= bodyData.weight * 0.6
      case 3:
        return bodyData.fat >= 5 && bodyData.fat <= bodyData.weight * 0.5
      default:
        return true
    }
  }

  const steps = [
    {
      title: '身高',
      field: 'height' as keyof BodyData,
      unit: 'cm',
      min: 140,
      max: 220,
      step: 1,
      description: '请输入你的身高'
    },
    {
      title: '体重',
      field: 'weight' as keyof BodyData,
      unit: 'kg',
      min: 40,
      max: 200,
      step: 0.1,
      description: '请输入你的体重'
    },
    {
      title: '肌肉重量',
      field: 'muscle' as keyof BodyData,
      unit: 'kg',
      min: 10,
      max: 100,
      step: 0.1,
      description: '估算你的肌肉重量'
    },
    {
      title: '脂肪重量',
      field: 'fat' as keyof BodyData,
      unit: 'kg',
      min: 5,
      max: 80,
      step: 0.1,
      description: '估算你的脂肪重量'
    }
  ]

  const currentStep = steps[step]
  const bmi = (bodyData.weight / Math.pow(bodyData.height / 100, 2)).toFixed(1)
  const bodyFatPct = ((bodyData.fat / bodyData.weight) * 100).toFixed(1)
  const musclePct = ((bodyData.muscle / bodyData.weight) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
            欢迎来到 FitTracker<span className="text-purple-500">.</span>
          </h1>
          <p className="text-gray-400">让我们先了解你的身体数据</p>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-6 py-8">

          {/* 3D Model */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-white/10">
            <Canvas shadows dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[0, 1, 3]} />

              {/* 光源设置 */}
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <pointLight position={[-5, 3, -5]} intensity={0.5} color="#a855f7" />
              <pointLight position={[5, 3, 5]} intensity={0.5} color="#3b82f6" />

              <BodyModel {...bodyData} />

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>

          {/* Input Form */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">

              {/* Progress */}
              <div className="flex gap-2 mb-8">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx <= step ? 'bg-purple-500' : 'bg-white/10'
                      }`}
                  />
                ))}
              </div>

              {/* Step Content */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
                <p className="text-gray-400 text-sm">{currentStep.description}</p>
              </div>

              {/* Input */}
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="number"
                    value={bodyData[currentStep.field]}
                    onChange={(e) => handleInputChange(currentStep.field, e.target.value)}
                    min={currentStep.min}
                    max={currentStep.max}
                    step={currentStep.step}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-3xl font-bold text-center focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    {currentStep.unit}
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  value={bodyData[currentStep.field]}
                  onChange={(e) => handleInputChange(currentStep.field, e.target.value)}
                  min={currentStep.min}
                  max={currentStep.max}
                  step={currentStep.step}
                  className="w-full mt-4 accent-purple-500"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-white/5 rounded-2xl">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">BMI</div>
                  <div className="text-lg font-bold">{bmi}</div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="text-xs text-gray-400 mb-1">体脂率</div>
                  <div className="text-lg font-bold">{bodyFatPct}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-1">肌肉率</div>
                  <div className="text-lg font-bold">{musclePct}%</div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  跳过
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex-1 py-3 px-6 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:bg-white/10 disabled:text-gray-500 transition-colors font-semibold"
                >
                  {step < 3 ? '下一步' : '开始训练'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
