import {Dispatch, SetStateAction} from 'react';
import axios from 'axios';
import {CommentExtended} from '../types/reply';

class CommentService {
    static ENDPOINT: string = process.env.REACT_APP_ENDPOINT as string;
    
    static async getComments(itemId: number): Promise<CommentExtended[]> {
        try {
            const response = await axios.get(`${this.ENDPOINT}/comments-get.php?itemId=${itemId}`);
            if (response.data.success) return response.data.value;
            console.error("Erro ao obter comentários:", response.data.message);
            return [];
        } catch (error) {
            console.error("Erro na requisição dos comentários:", error);
            return [];
        }
    }

    static async addComments(
        idUsuario: number,
        idProduto: number,
        nota: number,
        titulo: string,
        comentario: string,
        setMessage: Dispatch<SetStateAction<{success: boolean, msg: string}>>
    ): Promise<void> {
        if (Number(nota) < 0 || Number(nota) > 5){
            setMessage({success: false, msg: "Nota inválida"});
            return;
        }

        try {
            const res = await axios.post(`${this.ENDPOINT}/comments-add.php`, {
                idUsuario: idUsuario,
                idProduto: idProduto,
                nota: nota,
                titulo: titulo,
                comentario: comentario
            });

            if (res.data.success){
                setMessage({success: true, msg: "comentario enviado com sucesso!"});
                return;
            }

            setMessage({
                success: false,
                msg: `Erro ao enviar comentário: ${res.data.message}`
            });

        } catch(e){
            setMessage({success: false, msg: "Erro ao conectar com servidor!"});
        }
    }

    // static async removeComment(){}
    // static async editComment(){}
}

export default CommentService;
