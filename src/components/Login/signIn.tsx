import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loginCreator } from '../../actions/action'
import { AppState } from '../../store'
import { auth, fireStore } from '../../firebase/firebase'
import firebase from 'firebase'
import { withRouter, RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { loginDataType, UserState } from '../../types/type';
import "../../scss/signIn.scss"
import Button from '../../designSystem/Button';

type historyProps = RouteComponentProps


const SignIn: React.FC<historyProps> = (props) => {
    let [loginData, setLoginData] = useState<loginDataType>({ email: '', password: '' })
    let userData = useSelector((state: AppState) => state.userState)
    const dispatch = useDispatch()
    const login = (data: UserState) => dispatch(loginCreator(data))
    const handleSignIn = () => {
        const email = loginData.email
        const password = loginData.password
        auth.signInWithEmailAndPassword(email, password).then(res => {
            const user = res.user as firebase.User
            userData['userId'] = user.uid
        }).then(() => {
            fireStore.collection('user').doc(userData.userId).get()
                .then((doc) => {
                    if (doc.exists) {
                        userData = Object.assign({}, userData, {
                            userId: userData.userId
                        }, doc.data())
                        console.log('userData', userData)
                        login(userData)
                    }
                    else {
                        console.log("No such document!");
                    }
                }).then(() => {
                    props.history.push('/')
                }).catch((error) => {
                    console.log(error)
                })
        }).catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password')
            } else {
                alert(errorMessage)
            }
            console.log(error)
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as 'email' | 'password'
        loginData[name] = e.target.value
        setLoginData(Object.assign({}, loginData))
    }

    return (
        <div className="signIn">
            <p>メールアドレス</p>
            <input type="text" name="email" value={loginData.email} onChange={e => handleInputChange(e)}></input>
            <p>パスワード</p>
            <input type="password" name="password" value={loginData.password} onChange={e => handleInputChange(e)}></input>
            <div className="lrContents">
                <Link to='/signup'>登録はこちらから</Link>
                <Button blue onClick={() => handleSignIn()}>
                    ログイン
                </Button>
            </div>
        </div>
    )
}


export default withRouter<historyProps, React.FC<historyProps>>(SignIn)
