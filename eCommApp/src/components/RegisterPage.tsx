import { useState, type FormEvent } from 'react';
import Header from './Header';
import Footer from './Footer';

const RegisterPage = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('Cadastro não salvo: a integração com o sistema de autenticação será implementada posteriormente.');
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <section className="register-container" aria-labelledby="register-title">
                    <h2 id="register-title">Cadastrar usuário</h2>
                    <p>Informe os dados para criar um usuário.</p>
                    <form className="register-form" onSubmit={handleSubmit}>
                        <label htmlFor="register-username">
                            Usuário
                            <input
                                id="register-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                            />
                        </label>
                        <label htmlFor="register-password">
                            Senha
                            <input
                                id="register-password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                            />
                        </label>
                        <button type="submit">Cadastrar</button>
                    </form>
                    {status && <p className="register-status" role="status">{status}</p>}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterPage;