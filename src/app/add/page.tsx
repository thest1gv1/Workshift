'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SERVICES } from '@/constants/services'

import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'
import { LoaderCircle, Mic, SendHorizontal, X } from 'lucide-react'
import { ClientType } from '@/types/client'
import { shiftStore } from '@/store/shiftStore'
import { loadCurrentShift, saveClientToStore } from '@/store/clientsStore'

type VoiceState = 'idle' | 'requesting' | 'recording' | 'processing'

type VoiceInputResult = {
	transcript: string
	name: string | null
	services: Array<{
		id: string
		amount: number | null
	}>
}

function AddForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const id = searchParams.get('id')

	const shiftIdParam = searchParams.get('shift_id')

	const nameRef = useRef<HTMLInputElement>(null)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const mediaStreamRef = useRef<MediaStream | null>(null)
	const audioChunksRef = useRef<Blob[]>([])
	const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
		null,
	)
	const audioContextRef = useRef<AudioContext | null>(null)
	const animationFrameRef = useRef<number | null>(null)
	const voiceSendButtonRef = useRef<HTMLButtonElement>(null)
	const isUnmountingRef = useRef(false)
	const isCancellingRecordingRef = useRef(false)
	const [name, setName] = useState('')
	const [nameError, setNameError] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [type, setType] = useState<ClientType>('issued')
	const [selectedServices, setSelectedServices] = useState<string[]>([])
	const [amounts, setAmounts] = useState<Record<string, number>>({})
	const [note, setNote] = useState('')
	const [transferDate, setTransferDate] = useState('')
	const [transferSlot, setTransferSlot] = useState('')
	const [voiceState, setVoiceState] = useState<VoiceState>('idle')
	const [voiceTranscript, setVoiceTranscript] = useState('')
	const [recordingSeconds, setRecordingSeconds] = useState(0)

	const dates = Array.from({ length: 8 }, (_, i) => {
		const d = new Date()
		d.setDate(d.getDate() + i)
		return d
	})

	const slots = [
		'09:00–11:00',
		'11:00–13:00',
		'13:00–15:00',
		'15:00–17:00',
		'17:00–19:00',
		'19:00–21:00',
	]

	const dateKey = (d: Date) => d.toISOString().slice(0, 10)

	const paidServices = SERVICES.filter(
		s => selectedServices.includes(s.id) && s.hasAmount,
	)
	const formattedRecordingTime = `${Math.floor(recordingSeconds / 60)}:${String(recordingSeconds % 60).padStart(2, '0')}`

	const toggleService = (id: string) => {
		setSelectedServices(prev =>
			prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
		)
	}

	useEffect(() => {
		if (!id) nameRef.current?.focus()
	}, [id])

	useEffect(() => {
		return () => {
			isUnmountingRef.current = true
			if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current)
			if (recordingIntervalRef.current) {
				clearInterval(recordingIntervalRef.current)
			}
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current)
			}
			if (audioContextRef.current?.state !== 'closed') {
				void audioContextRef.current?.close()
			}
			if (mediaRecorderRef.current?.state === 'recording') {
				mediaRecorderRef.current.stop()
			}
			mediaStreamRef.current?.getTracks().forEach(track => track.stop())
		}
	}, [])

	const applyVoiceResult = (result: VoiceInputResult) => {
		const validServices = result.services.filter(item =>
			SERVICES.some(service => service.id === item.id),
		)

		setSelectedServices(previous => [
			...new Set([...previous, ...validServices.map(item => item.id)]),
		])
		setAmounts(previous => {
			const next = { ...previous }
			for (const item of validServices) {
				if (item.amount !== null) next[item.id] = item.amount
			}
			return next
		})
		setVoiceTranscript(result.transcript)
		const recognizedName = result.name?.trim()
		if (recognizedName && !name.trim()) {
			setName(recognizedName)
			setNameError(false)
		}

		if (validServices.length === 0) {
			if (recognizedName) {
				toast.success('Клиент заполнен')
			} else {
				toast.info('Речь распознана, но услуги не найдены')
			}
			return
		}

		toast.success(`Выбрано услуг: ${validServices.length}`)
	}

	const sendVoiceRecording = async (audio: Blob, extension: string) => {
		setVoiceState('processing')
		try {
			const formData = new FormData()
			formData.set('audio', audio, `voice.${extension}`)
			const response = await fetch('/api/voice-input', {
				method: 'POST',
				body: formData,
			})
			const result = (await response.json()) as VoiceInputResult & {
				error?: string
			}

			if (!response.ok) {
				throw new Error(result.error || 'Не удалось распознать голос')
			}

			applyVoiceResult(result)
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Не удалось распознать голос',
			)
		} finally {
			setVoiceState('idle')
		}
	}

	const stopRecording = () => {
		if (recordingTimerRef.current) {
			clearTimeout(recordingTimerRef.current)
			recordingTimerRef.current = null
		}
		if (mediaRecorderRef.current?.state === 'recording') {
			mediaRecorderRef.current.stop()
		}
	}

	const cancelRecording = () => {
		isCancellingRecordingRef.current = true
		stopRecording()
	}

	const startAudioVisualization = async (stream: MediaStream) => {
		try {
			const audioContext = new AudioContext()
			const analyser = audioContext.createAnalyser()
			const source = audioContext.createMediaStreamSource(stream)

			analyser.fftSize = 64
			analyser.smoothingTimeConstant = 0.72
			const frequencyData = new Uint8Array(analyser.frequencyBinCount)
			source.connect(analyser)
			audioContextRef.current = audioContext
			await audioContext.resume()

			const updateWaveform = () => {
				analyser.getByteFrequencyData(frequencyData)
				const averageLevel =
					frequencyData.reduce((sum, level) => sum + level, 0) /
					frequencyData.length /
					255
				const sendButton = voiceSendButtonRef.current

				if (sendButton) {
					const scale = 1 + Math.min(averageLevel * 0.22, 0.14)
					sendButton.style.transform = `scale(${scale})`
					sendButton.style.boxShadow = `0 0 ${8 + averageLevel * 18}px color-mix(in srgb, var(--primary) ${25 + averageLevel * 45}%, transparent)`
				}

				animationFrameRef.current = requestAnimationFrame(updateWaveform)
			}

			updateWaveform()
		} catch {
			// Запись продолжит работать даже без визуализации громкости.
			if (audioContextRef.current?.state !== 'closed') {
				void audioContextRef.current?.close()
			}
			audioContextRef.current = null
		}
	}

	const startRecording = async () => {
		if (
			typeof MediaRecorder === 'undefined' ||
			!navigator.mediaDevices?.getUserMedia
		) {
			toast.error('Этот браузер не поддерживает запись с микрофона')
			return
		}

		setVoiceState('requesting')
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: { echoCancellation: true, noiseSuppression: true },
			})
			if (isUnmountingRef.current) {
				stream.getTracks().forEach(track => track.stop())
				return
			}
			mediaStreamRef.current = stream

			const preferredTypes = [
				'audio/webm;codecs=opus',
				'audio/mp4',
				'audio/webm',
			]
			const mimeType = preferredTypes.find(type =>
				MediaRecorder.isTypeSupported(type),
			)
			const recorder = mimeType
				? new MediaRecorder(stream, { mimeType })
				: new MediaRecorder(stream)

			mediaRecorderRef.current = recorder
			isCancellingRecordingRef.current = false
			audioChunksRef.current = []
			recorder.ondataavailable = event => {
				if (event.data.size > 0) audioChunksRef.current.push(event.data)
			}
			recorder.onstop = () => {
				if (recordingIntervalRef.current) {
					clearInterval(recordingIntervalRef.current)
					recordingIntervalRef.current = null
				}
				if (animationFrameRef.current !== null) {
					cancelAnimationFrame(animationFrameRef.current)
					animationFrameRef.current = null
				}
				if (voiceSendButtonRef.current) {
					voiceSendButtonRef.current.style.transform = ''
					voiceSendButtonRef.current.style.boxShadow = ''
				}
				if (audioContextRef.current?.state !== 'closed') {
					void audioContextRef.current?.close()
				}
				audioContextRef.current = null
				stream.getTracks().forEach(track => track.stop())
				mediaStreamRef.current = null
				if (isUnmountingRef.current) return
				if (isCancellingRecordingRef.current) {
					isCancellingRecordingRef.current = false
					audioChunksRef.current = []
					setRecordingSeconds(0)
					setVoiceState('idle')
					return
				}
				const audio = new Blob(audioChunksRef.current, {
					type: recorder.mimeType || 'audio/webm',
				})
				const extension = recorder.mimeType.includes('mp4') ? 'm4a' : 'webm'
				if (audio.size === 0) {
					setVoiceState('idle')
					toast.error('Запись получилась пустой')
					return
				}
				void sendVoiceRecording(audio, extension)
			}

			recorder.start()
			setVoiceTranscript('')
			setRecordingSeconds(0)
			setVoiceState('recording')
			void startAudioVisualization(stream)
			recordingIntervalRef.current = setInterval(() => {
				setRecordingSeconds(seconds => seconds + 1)
			}, 1000)
			recordingTimerRef.current = setTimeout(stopRecording, 30_000)
		} catch (error) {
			mediaStreamRef.current?.getTracks().forEach(track => track.stop())
			mediaStreamRef.current = null
			if (recordingIntervalRef.current) {
				clearInterval(recordingIntervalRef.current)
				recordingIntervalRef.current = null
			}
			setVoiceState('idle')
			toast.error(
				error instanceof DOMException && error.name === 'NotAllowedError'
					? 'Разрешите доступ к микрофону в настройках браузера'
					: 'Не удалось включить микрофон',
			)
		}
	}

	const handleSave = async () => {
		if (isSaving) return
		if (!name.trim()) {
			setNameError(true)
			nameRef.current?.focus()
			return
		}

		setIsSaving(true)
		try {
			await loadCurrentShift()
			const shiftId = shiftIdParam ? Number(shiftIdParam) : shiftStore.get()?.id
			if (!id && !shiftId) throw new Error('Сначала начните смену')
			const data = {
				name: name.trim(),
				type,
				services: selectedServices,
				amounts,
				note,
				transferDate,
				transferSlot,
				shift_id: shiftId ?? null,
			}

			const response = await fetch(`/api/clients${id ? `/${id}` : ''}`, {
				method: id ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			})
			if (!response.ok)
				throw new Error('Не удалось сохранить клиента. Попробуйте ещё раз.')
			saveClientToStore(await response.json())

			toast.success(id ? 'Клиент обновлен' : 'Клиент добавлен')

			router.push(shiftIdParam ? `/history/${shiftIdParam}` : '/')
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Не удалось сохранить клиента',
			)
		} finally {
			setIsSaving(false)
		}
	}

	useEffect(() => {
		if (!id) return

		fetch(`/api/clients/${id}`)
			.then(res => res.json())
			.then(client => {
				setName(client.name)
				setType(client.type)
				setSelectedServices(client.services)
				setAmounts(client.amounts)
				setNote(client.note)
				setTransferDate(client.transferDate ?? '')
				setTransferSlot(client.transferSlot ?? '')
			})
	}, [id])

	const close = () => {
		router.push(shiftIdParam ? `/history/${shiftIdParam}` : '/')
	}

	return (
		<div className='grid gap-5'>
			<div className='flex items-center justify-between'>
				<h1>{id ? 'Клиент' : 'Новый клиент'}</h1>
				<Button
					variant='ghost'
					size='icon'
					className='rounded-full'
					onClick={close}
				>
					<X />
				</Button>
			</div>
			<div className='grid gap-2'>
				<label
					htmlFor='name'
					className='text-muted-foreground text-xs tracking-wider uppercase'
				>
					клиент <span className='text-primary'>*</span>
				</label>
				<Input
					id='name'
					ref={nameRef}
					value={name}
					placeholder='Иванов А.А.'
					type='text'
					aria-invalid={nameError}
					aria-describedby={nameError ? 'name-error' : undefined}
					onChange={e => {
						setName(e.target.value)
						if (nameError) setNameError(false)
					}}
				/>
				{nameError && (
					<p id='name-error' className='text-destructive text-xs'>
						Введите ФИО клиента
					</p>
				)}
			</div>

			<div className='grid gap-2'>
				<span className='text-muted-foreground text-xs tracking-wider uppercase'>
					Тип
				</span>

				<div className='text-muted-foreground grid grid-cols-3 gap-2'>
					<Button
						className={
							type === 'issued'
								? 'bg-primary/20! text-primary! border-primary/50!'
								: ''
						}
						size='lg'
						variant='outline'
						disabled={voiceState !== 'idle'}
						onClick={() => setType('issued')}
					>
						Выдано
					</Button>
					<Button
						className={
							type === 'transfer'
								? 'bg-amber/20! text-amber! border-amber/50!'
								: ''
						}
						size='lg'
						variant='outline'
						disabled={voiceState !== 'idle'}
						onClick={() => setType('transfer')}
					>
						Перенос
					</Button>
					<Button
						className={
							type === 'rejected'
								? 'bg-destructive/20! text-destructive! border-destructive/50!'
								: ''
						}
						size='lg'
						variant='outline'
						disabled={voiceState !== 'idle'}
						onClick={() => setType('rejected')}
					>
						Отказ
					</Button>
				</div>
			</div>

			{type === 'issued' && (
				<div className='grid gap-2'>
					<span className='text-muted-foreground text-xs tracking-wider uppercase'>
						Быстрый ввод
					</span>

					{voiceState === 'idle' && (
						<button
							type='button'
							className='border-primary/30 bg-primary/5 hover:bg-primary/10 focus-visible:ring-ring flex min-h-16 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors outline-none focus-visible:ring-3'
							onClick={startRecording}
						>
							<span className='from-primary to-accent2 text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r shadow-sm'>
								<Mic className='size-5' />
							</span>
							<span className='grid gap-0.5'>
								<span className='text-sm font-medium'>
									Добавить услуги голосом
								</span>
								<span className='text-muted-foreground text-xs'>
									Назовите продукты и суммы одним сообщением
								</span>
							</span>
						</button>
					)}

					{voiceState === 'recording' && (
						<div
							className='border-primary/30 bg-background grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border px-3 py-2 shadow-sm'
							role='status'
							aria-live='polite'
						>
							<div className='flex items-center gap-2'>
								<span
									className='relative flex size-2.5 shrink-0'
									aria-hidden='true'
								>
									<span className='bg-destructive absolute inline-flex size-full animate-ping rounded-full opacity-50' />
									<span className='bg-destructive relative inline-flex size-2.5 rounded-full' />
								</span>
								<span className='font-mono text-sm font-medium tabular-nums'>
									{formattedRecordingTime}
								</span>
							</div>
							<button
								type='button'
								className='text-primary hover:text-primary/75 justify-self-center px-3 py-2 text-sm font-medium transition-colors'
								onClick={cancelRecording}
								aria-label='Отменить запись'
							>
								Отмена
							</button>
							<button
								ref={voiceSendButtonRef}
								type='button'
								className='from-primary to-accent2 text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r shadow-sm transition-[transform,box-shadow] duration-75 active:scale-95!'
								onClick={stopRecording}
								aria-label='Отправить запись'
								title='Отправить запись'
							>
								<SendHorizontal className='size-5 fill-current' />
							</button>
						</div>
					)}

					{(voiceState === 'requesting' || voiceState === 'processing') && (
						<div
							className='border-primary/30 bg-primary/5 flex min-h-16 items-center gap-3 rounded-2xl border px-4 py-3'
							role='status'
							aria-live='polite'
						>
							<span className='bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-full'>
								<LoaderCircle className='size-5 animate-spin' />
							</span>
							<span className='grid gap-0.5'>
								<span className='text-sm font-medium'>
									{voiceState === 'requesting'
										? 'Включаем микрофон…'
										: 'Распознаём запись…'}
								</span>
								<span className='text-muted-foreground text-xs'>
									{voiceState === 'requesting'
										? 'Подтвердите доступ в браузере'
										: 'Подбираем услуги и заполняем суммы'}
								</span>
							</span>
						</div>
					)}

					{voiceTranscript && voiceState === 'idle' && (
						<p className='border-primary/20 bg-primary/5 text-muted-foreground rounded-xl border px-3 py-2 text-xs leading-relaxed'>
							<span className='text-foreground font-medium'>Распознано:</span> «
							{voiceTranscript}»
						</p>
					)}

					<span className='text-muted-foreground mt-2 text-xs tracking-wider uppercase'>
						Услуги
					</span>
					<div className='flex flex-wrap gap-2'>
						{SERVICES.map(service => (
							<span
								className={cn(
									'cursor-pointer rounded-full border px-3 py-1 text-xs',
									selectedServices.includes(service.id)
										? 'bg-primary/20 text-primary border-primary/50'
										: 'text-muted-foreground border-border',
								)}
								key={service.id}
								onClick={() => toggleService(service.id)}
							>
								{service.label}
							</span>
						))}
					</div>
				</div>
			)}

			{type === 'transfer' && (
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<span className='text-muted-foreground text-xs tracking-wider uppercase'>
							Дата
						</span>
						<div className='flex scrollbar-none gap-2 overflow-x-auto pb-1'>
							{dates.map(d => {
								const key = dateKey(d)
								return (
									<button
										key={key}
										onClick={() => setTransferDate(key)}
										className={cn(
											'shrink-0 rounded-xl border px-3 py-2 text-center text-xs transition-colors',
											transferDate === key
												? 'bg-amber/20 text-amber border-amber/50'
												: 'text-muted-foreground border-border',
										)}
									>
										<div className='font-medium'>
											{d.toLocaleDateString('ru-RU', {
												day: 'numeric',
												month: 'short',
											})}
										</div>
										<div className='opacity-70'>
											{d.toLocaleDateString('ru-RU', { weekday: 'short' })}
										</div>
									</button>
								)
							})}
						</div>
					</div>
					<div className='grid gap-2'>
						<span className='text-muted-foreground text-xs tracking-wider uppercase'>
							Слот
						</span>
						<div className='grid grid-cols-2 gap-2'>
							{slots.map(slot => (
								<button
									key={slot}
									onClick={() => setTransferSlot(slot)}
									className={cn(
										'rounded-xl border px-3 py-3 text-sm transition-colors',
										transferSlot === slot
											? 'bg-amber/20 text-amber border-amber/50'
											: 'text-muted-foreground border-border',
									)}
								>
									{slot}
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{type !== 'transfer' && (
				<div className='grid gap-2'>
					<span className='text-muted-foreground text-xs tracking-wider uppercase'>
						Примечания
					</span>
					<div>
						<textarea
							className='bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-ring h-20 w-full resize-none rounded-lg border p-3 text-sm outline-none'
							value={note}
							placeholder='Проблемы, нет доступа к лк, арест...'
							onChange={e => setNote(e.target.value)}
						/>
					</div>
				</div>
			)}

			{type === 'issued' && paidServices.length > 0 && (
				<div className='grid gap-2'>
					<span className='text-muted-foreground text-xs tracking-wider uppercase'>
						Суммы по услугам
					</span>
					<div className='bg-muted rounded-2xl p-4'>
						<ul className='grid gap-2'>
							{paidServices.map(service => (
								<li
									className='flex items-center justify-between gap-4'
									key={service.id}
								>
									<div className='flex items-center justify-between gap-2'>
										<span className='bg-primary h-2 w-2 rounded-full' />
										<span className='w-20'>{service.label}</span>
									</div>

									<Input
										className='flex-1'
										value={
											amounts[service.id]
												? amounts[service.id].toLocaleString('ru-RU')
												: ''
										}
										placeholder='0'
										inputMode='numeric'
										onChange={e => {
											const raw = Number(e.target.value.replace(/\D/g, ''))
											setAmounts(prev => ({
												...prev,
												[service.id]: raw,
											}))
										}}
									/>
									<span className='text-muted-foreground'>₽</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			<Button
				size='lg'
				onClick={handleSave}
				disabled={isSaving || voiceState !== 'idle'}
			>
				{isSaving ? 'Сохраняем…' : 'Сохранить клиента'}
			</Button>
		</div>
	)
}
export default function AddPage() {
	return (
		<Suspense>
			<AddForm />
		</Suspense>
	)
}
