import { Input } from '@/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
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
    <div id="FormJob" className='translate-y-5 border-2 shadow-xl border-gray-200 rounded-2xl bg-white place-self-center pt-2'>
      <div id="HeadJob"><h1 className='pl-2.5 pr-2.5 pt-5 place-self-center text-black text-6xl mb-5'>Rejestracja</h1></div>
      <form className='place-self-center' onSubmit={handleSubmit}>
        <label className='m-2' htmlFor="name">Nazwa użytkownika:</label><br/>
        <input onChange={(e) => setName(e.target.value)} value={name} className='p-1 rounded-lg bg-white border-2 border-gray-400 text-gray-600 hover:border-black hover:text-black m-2' type="text" id="name" name="name"/><br/>
        <label className='m-2' htmlFor="password1">Hasło:</label><br/>
        <input onChange={(e) => setPassword1(e.target.value)} value={password1} className='p-1 rounded-lg bg-white border-2 border-gray-400 text-gray-600 hover:border-black hover:text-black m-2' type="password" id="password1" name="password1"/><br/>
        <label className='m-2' htmlFor="password2">Powtórz hasło:</label><br/>
        <input onChange={(e) => setPassword2(e.target.value)} value={password2} className='p-1 rounded-lg bg-white border-2 border-gray-400 text-gray-600 hover:border-black hover:text-black m-2' type="password" id="password2" name="password2"/><br/>
        <Input className='rounded-lg bg-gray-300 text-gray-950 w-min m-2' type="submit" value="Rejestruj"/>
        <div id='MessageText' className='ml-2 text-orange-500'>{message}</div>
        <a href="login.tsx" className='hover:text-purple-600 text-blue-700 m-2'>Mam już konto</a>
      </form>

    </div>
  </div>
  </>
}
