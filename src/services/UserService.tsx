import axios from 'axios';
import {Dispatch, SetStateAction} from 'react';
import type {User, SimplUser} from '../types/user';

class UserService {
    static ENDPOINT: string = process.env.REACT_APP_ENDPOINT as string;

    static genericUser(){
        return {
            nome: '',    email: '',       data_nascimento: '',    telefone: '',
            senha: '',   cep: '',         rua: '',                numero: '',
            bairro: '',  complemento: '', cidade: '',             estado: '',
            admin: 0
        } as User; 
    }

    // todos usuários apenas no caso tenha código de acesso.
    // determinado usuário via email e/ou id, também apenas com código de acesso.
    static async getUsers(
        params: {
            accessCode: string,
            byEmail?: string,
            byId?: number
        },
        setUsers: Dispatch<SetStateAction<User[]>>,
        setError: Dispatch<SetStateAction<string>>
    ){
        try {
            const response = await axios.get(`${this.ENDPOINT}/users-get.php`, {
                params: { 
                    accessCode: params.accessCode,
                    ...(params.byEmail && { byEmail: params.byEmail }),
                    ...(params.byId !== undefined && { byId: String(params.byId) })
                }
            });

            if (Array.isArray(response.data.value) && response.data.value.length > 0){
                setUsers(response.data.value);
                setError('');
                return;
            } 

            setError(response.data.message);
            setUsers([]);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw error;
        }
    }


    static async registerUser(
        formData: User,
        setErrorMessage: Dispatch<SetStateAction<string>>,
    ): Promise<boolean> {

        try {
            const response = await axios.post(
                `${this.ENDPOINT}/user-register.php`,
                formData, {
                    headers: {
                    'Content-Type': 'application/json' 
                    }
                }
            );

            if (response.data.success){
                setErrorMessage('');
                alert("Um email foi enviado." + 
                      "Para finalizar seu cadastro, confirme seu email!");

                return true;
            }

            setErrorMessage(response.data.message || "Erro desconhecido");
            return false;

        } catch (error) {
            setErrorMessage('Erro na comunicação com o servidor: ' + error);
            return false;
        }
    }


    static async updateUser(
        newFormUser: FormData
    ): Promise<SimplUser | null> {
        try {
            const response = await axios.post(
                `${this.ENDPOINT}/user-update.php`,
                newFormUser,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                }
            );

            return response.data.success 
                ? response.data.value as SimplUser
                : null;
        } catch(e){
            console.error(e);
            return null;
        }
    }


    // static async deleteUser() {};
};

export default UserService;
