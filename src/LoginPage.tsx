import * as React from 'react';
import * as firebase from 'firebase/app';
import { firebaseAuth } from './util/firebase';

import { Dispatch, AnyAction } from 'redux';
import * as actions from './actions';
import { PAGES } from './reducer';

import './LoginPage.css';
import GgoogleIcon from './img/google-icon.png';



/* ---------------------------------
    Error Enum
---------------------------------- */
const ERROR_STATE = {
    NO_ERROR: 0,
    EMAIL_ERROR_ENPTY: 1,
    EMAIL_ERROR_WRONG: 2,
    PASSWORD_ERROR: 3,
    FIREBASE_ERROR: 4,
};

const errorText = [
    '',
    'メールアドレスがありません',
    'メールアドレスが無効です',
    'パスワードが無効です',
    'メールアドレスかパスワードが間違っています',
];


/* ---------------------------------
    型宣言
---------------------------------- */
interface IProps {
    dispatch: Dispatch<AnyAction>;
}

interface IState {
    email: string;
    password: string;
    errorState: number;
}



class LoginPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorState: ERROR_STATE.NO_ERROR,
        };
    }

    public componentDidMount() {
        firebaseAuth.onAuthStateChanged((currentUser: firebase.User | null) => {
            this.props.dispatch(actions.changeUser(currentUser));
        });
    }

    public emailLogin(email: string, password: string) {
        if (email === '') {
            this.setState({
                errorState: ERROR_STATE.EMAIL_ERROR_ENPTY,
            });
            return;
        }
        if (!this.emailCheck(email)) {
            this.setState({
                errorState: ERROR_STATE.EMAIL_ERROR_WRONG,
            });
            return;
        }
        if (!this.passCheck(password)) {
            this.setState({
                errorState: ERROR_STATE.PASSWORD_ERROR,
            });
            return;
        }
        firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(user => {
                console.log('Succeeded Login with email');
                console.log(user);
                this.setState({
                    email: '',
                    password: '',
                    errorState: ERROR_STATE.NO_ERROR,
                });
            })
            .catch(error => {
                console.log('Failed Login with email');
                this.setState({
                    errorState: ERROR_STATE.FIREBASE_ERROR,
                });
            });
    }

    // メールアドレスチェック関数
    // https://kantaro-cgi.com/blog/javascript/javascript_mailaddress_check.html
    public emailCheck(email: string) {
        // databaseでメールアドレスの存在を確認

        const mailRegex1 = new RegExp(/(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|'(?:[!#-\[\]-~]|\\\\[\x09 -~])*')@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*/);
        const mailRegex2 = new RegExp(/^[^\@]+\@[^\@]+$/);
        if (email.match(mailRegex1) && email.match(mailRegex2)) {
            // 全角チェック
            if (email.match(/[^a-zA-Z0-9\!\'\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/)) { return false; }
            // 末尾TLDチェック（〜.co,jpなどの末尾ミスチェック用）
            if (!email.match(/\.[a-z]+$/)) { return false; }
            return true;
        }
        return false;
    }

    // パスワードチェック関数
    public passCheck(password: string) {
        // databaseでパスワードの一致を確認

        if (password.match(/^[A-Za-z0-9]{8,20}/)) {
            return true;
        }
        return false;
    }

    public setFormColor(inputType: string) {
        if (inputType === 'email') {
            if (this.state.errorState === ERROR_STATE.EMAIL_ERROR_ENPTY || this.state.errorState === ERROR_STATE.EMAIL_ERROR_WRONG) {
                // 赤
                return {
                    backgroundColor: '#FBEDEB',
                    borderColor: '#EB5946',
                };
            }
            if (this.state.errorState === ERROR_STATE.NO_ERROR) {
                if (this.emailCheck(this.state.email)) {
                    // 黄色
                    return {
                        backgroundColor: '#FAFEBD',
                        borderColor: '#CDD2D4',
                    };
                }
                // グレー
                return {
                    backgroundColor: '#EDEFF0',
                    borderColor: '#CDD2D4',
                };
            }
        } else if (inputType === 'password') {
            if (this.state.errorState === ERROR_STATE.PASSWORD_ERROR) {
                // 赤
                return {
                    backgroundColor: '#FBEDEB',
                    borderColor: '#EB5946',
                };
            }
            if (this.state.errorState === ERROR_STATE.NO_ERROR) {
                if (this.passCheck(this.state.password)) {
                    // 黄色
                    return {
                        backgroundColor: '#FAFEBD',
                        borderColor: '#CDD2D4',
                    };
                }
                // グレー
                return {
                    backgroundColor: '#EDEFF0',
                    borderColor: '#CDD2D4',
                };
            }
        }
        return {
            backgroundColor: '#EDEFF0',
            borderColor: '#CDD2D4',
        };
    }

    public googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebaseAuth.signInWithRedirect(provider);
    }

    public logout() {
        firebaseAuth.signOut();
    }

    /* ---------------------------------
        レンダリング関数
    ---------------------------------- */
    public render(): JSX.Element {
        return (
            <div className={'form-container'}>
                {/* エラー */}
                {this.state.errorState !== ERROR_STATE.NO_ERROR
                 ?  <div className={'error-text'}>
                        {errorText[this.state.errorState]}
                    </div>
                 :  null
                }

                {/* タイトル部分 */}
                <div className={'login-page-title'}>
                    React-Trello-App にログイン
                </div>
                <div>
                    <div className={'create-account-or'}>
                        or
                    </div>
                    <div className={'create-account-button'}
                        onClick={() => {
                            console.log('ページ移動');
                            this.props.dispatch(actions.changePage(PAGES.CREATE_ACCOUNT));
                        }}
                        >
                        アカウントを作成
                    </div>
                </div>

                {/* 入力フォーム */}
                <div className="login-input-label">
                    メールアドレス
                </div>
                <input
                    id={'email-input'}
                    className="login-input"
                    type="text"
                    placeholder="有効なメールアドレスを入力してください"
                    onChange={e => this.setState({ email: e.target.value })}
                    style={this.setFormColor('email')}
                    />
                <div className="login-input-label">
                    パスワード
                </div>
                <input
                    id={'password-input'}
                    className="login-input"
                    type="password"
                    placeholder="半角英数字のみの8~20文字を入力してください"
                    onChange={e => this.setState({ password: e.target.value })}
                    style={this.setFormColor('password')}
                    />
                <button
                    className="login-button"
                    onClick={e => {
                        e.preventDefault();
                        this.emailLogin(this.state.email, this.state.password);
                    }}
                    >
                    ログイン
                </button>

                {/* Googleログイン/ログアウトボタン */}
                <button
                    className="login-google-button"
                    onClick={this.googleLogin}
                    >
                    <img
                        className="login-google-button-icon"
                        src={GgoogleIcon}
                        />
                    <div className="login-google-button-text">
                        Googleアカウントでログイン
                    </div>
                </button>
            </div>
        );
    }
}

export default LoginPage;
