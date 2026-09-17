import { createFileRoute, Link } from '@tanstack/react-router'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';

export const Route = createFileRoute("/login")({
  component: Index,
});

function Index() {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");

  function handleSubmit(ev: React.SubmitEvent) {
    ev.preventDefault()

    if(username === "") {
        setMessage("Nazwa użytkownika nie może być pusta!")
        return
    }

    if(password === "") {
        setMessage("Hasło nie może być puste!")
        return
    }

    // ...logika api...
    setMessage('')
    alert(username + "\n" + password)
  }

  return (
    <div className="self-stretch h-screen">
      <div className="place-self-center items-center border-2 border-gray-200 shadow-xl rounded-2xl translate-y-5">
        <div><h2 className="place-self-center text-5xl pl-2.5 pr-2.5 pt-5 mb-5">Logowanie</h2></div>
        <form className="place-self-center" onSubmit={handleSubmit}>
            <Label className="m-2" htmlFor="username">Nazwa użytkownika:</Label>
            <Input className="m-2 w-23/24 pr-2" id="username" name="username" type="text" onChange={(ev) => setUsername(ev.target.value)} value={username} />
            <Label className="m-2" htmlFor="password">Hasło:</Label>
            <Input className="m-2 w-23/24 pr-2" id="password" name="password" type="password" onChange={(ev) => setPassword(ev.target.value)} value={password} />

            <Input className='m-2 w-min rounded-lg' type="Submit" value='Zaloguj się' />
            <div className='m-2 text-orange-500'>{message}</div>
            <Link to={"/register" as any} className="text-blue-700 hover:text-purple-600 m-2">Nie mam jeszcze konta</Link>
        </form>
      </div>
    </div>
  );
}
