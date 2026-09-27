import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUpRoute,
})

function SignUpRoute() {
  const [name, setName] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [message, setMessage] = useState('')
  
  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    
    if (password1 !== password2) {
      setMessage('Hasła muszą być takie same')
      return
    }

    setMessage('')
    //tu logika api
  }
  return <>
  <div id="page" className='fill-white bg-white self-stretch text-gray-900 text-lg h-screen'>
    <div id="FormJob" className='translate-y-5 border-2 shadow-xl border-gray-200 rounded-2xl bg-white place-self-center'>
      <div id="HeadJob"><h2 className='pl-2.5 pr-2.5 pt-5 place-self-center text-black text-5xl mb-5'>Rejestracja</h2></div>
      <form className='place-self-center' onSubmit={handleSubmit}>
        <Label className='m-2' htmlFor="name">Nazwa użytkownika:</Label>
        <Input className='m-2 w-23/24 pr-2' onChange={(e) => setName(e.target.value)} value={name} type="text" id="name" name="name"/>
        <Label className='m-2' htmlFor="password1">Hasło:</Label>
        <Input className='m-2 w-23/24' onChange={(e) => setPassword1(e.target.value)} value={password1} type="password" id="password1" name="password1"/>
        <Label className='m-2' htmlFor="password2">Powtórz hasło:</Label>
        <Input className='m-2 w-23/24' onChange={(e) => setPassword2(e.target.value)} value={password2} type="password" id="password2" name="password2"/>
        <Input className='rounded-lg w-min m-2' type="submit" value="Rejestruj"/>
        <div id='MessageText' className='ml-2 text-orange-500'>{message}</div>
        <Link to="/sign-in" className='hover:text-purple-600 text-blue-700 m-2'>Mam już konto</Link>
      </form>

    </div>
  </div>
  </>
}
