import {useUser} from '../context/userContext';
import '../styles/css/user-profile-display.css';

const UserProfileDisplay = () => {
    const {user} = useUser();
    if (!user) return null;

    return (
        <div className="user-profile-display">
            <img className="user-profile-picture"
                 alt="profile picture"
                 src={`data:image/png;base64,${user.foto}`}/>
            <div className="user-info">
                <p className="user-name">{user.nome}</p>
                <p className="user-email">{user.email}</p>
            </div>
        </div>
        
    );
}

export default UserProfileDisplay;
