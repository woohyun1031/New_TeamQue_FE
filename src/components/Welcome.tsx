import styled from 'styled-components';

interface Props {
	name: string;
	verse: string;
}

const Welcome: React.FC<Props> = ({ name, verse }) => {
	return (
		<Container>
			<h2>안녕하세요,</h2>
			<h2>{name} 님</h2>
			<p>{verse}</p>
		</Container>
	);
};
export default Welcome;

const Container = styled.div`
	/* 사이즈 */
	width: 580px;
	height: 290px;
	/* 임시 스타일 코드 */
	background-color: #fff;
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
	border-radius: 7px;
`;
