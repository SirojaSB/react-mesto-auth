const Login = () =>{
    return (
        <div className="login">
            <h1 className="login__title">Вход</h1>
            <form className="login__form">
                <input className="login__email" type="email" placeholder="Email"/>
                <input className="login__pass" type="password" placeholder="Пароль"/>
                <button className="login__submit" type="submit">Войти</button>
            </form>
        </div>
    )
}

export default Login