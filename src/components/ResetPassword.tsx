import { useState } from 'react';
import axios from 'axios';
import Utils from '../types/Utils';

const ResetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [verificationCodeSent, setVerificationCodeSent] = useState({
        code: "00000",
        sent: false 
    });

    const endpoint = process.env.REACT_APP_ENDPOINT;

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${endpoint}/send-reset-email.php`, 
            {email}, 
            { withCredentials: true });
            if (response.data.success){
                setVerificationCodeSent({ code: response.data.value, sent: true });
                setStep(2);
                setErrorMessage("");   
            } else {
                setErrorMessage(response.data.message);
            }

        } catch(_){
            setErrorMessage("Erro ao enviar e-mail. Tente novamente.");
            console.log("Erro ao enviar e-mail. Tente novamente");
        }
    };

    const handleVerificationSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (verificationCode === verificationCodeSent.code) {
            setStep(3);
            setErrorMessage("");
        } else {
            setErrorMessage('Código de verificação incorreto.');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        try {
            const response = await axios.post(
                `${endpoint}/user-update.php`,
                {email: email, senha: newPassword},
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.data.success){
                alert('Senha alterada com sucesso!');
                setStep(1);
                setErrorMessage("");
            } else {
                setErrorMessage(response.data.message);
            }

        } catch(e){
            console.log("Erro: submit password");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="p-4">
                {step === 1 && (
                <>
                    <p>Insira seu e-mail para redefinir sua senha.</p>
                    <form onSubmit={handleEmailSubmit}>
                        <div className="mb-3">
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Enviar Link de Redefinição
                            </button>
                        </div>
                    </form>
                    {/*verificationCodeSent.sent && (
                        <p className="mt-3">
                            Um código de verificação foi enviado para o seu e-mail.
                        </p>
                    )*/}
                </>
                )}

                {step === 2 && (
                <>
                    <p>Insira o código de verificação enviado no seu e-mail.</p>
                    <form onSubmit={handleVerificationSubmit}>
                        <div className="mb-3">
                            <label htmlFor="verificationCode" className="form-label">Código de Verificação</label>
                            <input
                                type="text"
                                id="verificationCode"
                                className="form-control"
                                placeholder="Código de 5 dígitos"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                maxLength={5}
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Verificar Código
                            </button>
                        </div>
                    </form>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </>
                )}

                {step === 3 && (
                <>
                    <p>Insira sua nova senha.</p>
                    <form onSubmit={async (e) => handlePasswordSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">Nova Senha</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                placeholder="Digite sua nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="form-control"
                                    placeholder="Confirme sua nova senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Alterar Senha
                            </button>
                        </div>
                    </form>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </>
                )}
            </div>
        </div>
        );
    };

export default ResetPassword;
