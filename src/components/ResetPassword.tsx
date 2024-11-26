import { useState } from 'react';
// import axios from 'axios';

const ResetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);

    // // TODO
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // aqui: enviar email!
        setVerificationCodeSent(true);
        setStep(2);
        setErrorMessage("");
    };

    // nao funciona no localhost 
    // const handleEmailSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //
    //     const emailData = {
    //         email: email,
    //         verification_code: '12345',
    //     };
    //
    //     try {
    //         const response = await axios.post('http://localhost/php-loja-back/send-email.php', emailData, {
    //             withCredentials: true,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    //
    //         const result = response.data;
    //         console.log(result);
    //
    //         if (result.success) {
    //             setVerificationCodeSent(true);
    //             setStep(2);
    //         } else {
    //             setErrorMessage(result.message);
    //         }
    //     } catch (error) {
    //         setErrorMessage('Erro na comunicação com o servidor.');
    //     }
    // };

    // TODO
    const handleVerificationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // aqui: gerar um codigo
        // fingir um codigo de verificcao
        if (verificationCode === '12345') {
            setStep(3);
            setErrorMessage("");
        } else {
            setErrorMessage('Código de verificação incorreto.');
        }
    };

    // TODO: 
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        // aqui: requisicao num endpoint php para update nova senha
        alert('Senha alterada com sucesso!');
        setStep(1);
        setErrorMessage("");
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
                    {verificationCodeSent && (
                        <p className="mt-3">Um código de verificação foi enviado para o seu e-mail.</p>
                    )}
                </>
                )}

                {step === 2 && (
                <>
                    <p>Insira o código de verificação enviado para seu e-mail.</p>
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
                    <form onSubmit={handlePasswordSubmit}>
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
