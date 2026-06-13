'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
	const [show, setShow] = useState(false)
	const [code, setCode] = useState('')

	const router = useRouter()

	const handleLogin = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ key: code }),
		})

		const data = await res.json()

		if (data.ok) {
			// сохранить в localStorage и редирект
			document.cookie = 'auth=true; path=/'
			router.push('/workshift')
		} else {
			toast.error('Неверный код доступа')
		}
	}

	return (
		<div className='grid w-full max-w-sm gap-6'>
			<div className='grid gap-1'>
				<h1>WorkShift</h1>
				<p className='text-muted-foreground text-sm'>
					Введите код доступа для входа
				</p>
			</div>
			<div className='grid gap-3'>
				<div className='relative'>
					<Input
						placeholder='Код доступа'
						type={show ? 'text' : 'password'}
						className='pr-10'
						value={code}
						onChange={e => setCode(e.target.value)}
					/>
					<button
						type='button'
						onClick={() => setShow(prev => !prev)}
						className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2'
					>
						{show ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				</div>
				<Button size='lg' onClick={handleLogin}>
					Войти
				</Button>
			</div>
		</div>
	)
}
