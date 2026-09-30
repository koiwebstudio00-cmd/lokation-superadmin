import { LoginForm } from "./login-form";

export default function LoginPage() {
  return <main className="login"><div className="panel"><p className="eyebrow">Ubikka · Operaciones</p>
    <h1>Acceso super admin</h1><p>Iniciá sesión con tu cuenta de operador.</p><LoginForm /></div></main>;
}
