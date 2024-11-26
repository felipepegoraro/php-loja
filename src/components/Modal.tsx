import '../styles/css/Modal.css';

export interface ModalProps {
    show: boolean;
    onHide: () => void;
    title: string;
    body: React.ReactNode;
};

const Modal = (props: ModalProps) => {
    const {show, onHide, title, body} = props;

    return show ? (
        <div className="modal-container">
            <div className="modal-header">
                <h3>{title}</h3>
                <button className="secondary" onClick={onHide}>X</button>
            </div>
            <div className="modal-body">
                {body}
            </div>
        </div>
    ) : null;
};

export default Modal;
