import { Chatbot } from 'supersimpledev'
import userImg from '../assets/user.png'
import robotImg from '../assets/robot.png'

export function ChatMessage({ message, sender, time }) {

    return (
        <div className={
            sender === 'user' ? 'chatTextUser' : 'chatTextRobot'
        }>
            {sender === 'robot' && <img className='profileImg' src={robotImg} alt="" />}

            <div className="chatText">
                <p>{message}</p>
                <p className='chatTime'>{time}</p>
            </div>

            {sender === 'user' && <img className='profileImg' src={userImg} alt="" />}
        </div>
    )
}