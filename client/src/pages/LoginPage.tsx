import {signInWithGoogle} from '../utils/firebase'


const LoginPage = () => {
    return (
        <div>
            <button onClick={signInWithGoogle}>Sign In</button>
        </div>
    )
}

export default LoginPage;