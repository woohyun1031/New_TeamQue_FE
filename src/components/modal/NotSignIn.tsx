import { useDispatch } from "react-redux";
import { changeModal } from "../../store/modules/modal";

const NotSignIn = () => {
  const dispatch = useDispatch()
  const toSignIn = () => {
    dispatch(changeModal('signIn'))
  }
	return (
		<>
			<h1>notSignIn</h1>
      <button onClick={toSignIn}>로그인 하러</button>
		</>
	);
};

export default NotSignIn;
