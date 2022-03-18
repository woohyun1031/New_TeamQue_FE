export const checkEmail = (email: string) => {
	if (email === '') {
		return { res: false, msg: '이메일을 입력해주세요' };
	} else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		return { res: false, msg: '올바른 이메일을 입력해주세요' };
	}
	return { res: true };
};

export const checkNickname = (nickname: string) => {
	if (nickname === '') {
		return { res: false, msg: '닉네임을 입력해주세요' };
	} else if (nickname.length < 3 || !/^[a-z,A-Z,0-9]{3,}$/.test(nickname)) {
		return { res: false, msg: '올바른 닉네임을 입력해주세요' };
	}
	return { res: true };
};

export const checkPW = (password: string, confirmpassword: string) => {
	if (password === '') {
		return { res: false, msg: '비밀번호를 입력해주세요' };
	} else if (confirmpassword === '') {
		return { res: false, msg: '비밀번호 확인을 입력해주세요' };
	} else if (password !== confirmpassword) {
		return {
			res: false,
			msg: '비밀번호를 올바르게 입력했는지 확인해주세요',
		};
	}
	return {
		res: true,
	};
};