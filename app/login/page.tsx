import LoginForm from "./LoginForm";
import s from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={s.wrap}>
      <LoginForm />
    </div>
  );
}
