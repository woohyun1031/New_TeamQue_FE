import styled from 'styled-components';
import character from '../assets/character1.png';


interface Props {
	name: string;
	verse: string;
}

const Welcome: React.FC<Props> = ({ name, verse }) => {
	return (
		<Container>
			<WelcomeMessage>안녕하세요,</WelcomeMessage>
			<WelcomeMessage>{name} 님</WelcomeMessage>
			<VerseBox>
				<Verse>{verse}</Verse>
				<VerseDecoration />
			</VerseBox>
			<Character src={character}/>
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
	padding: 36px 40px;
	position: relative;
`;

const WelcomeMessage = styled.h2`
	font-size: 26px;
	margin-bottom: 10px;
`;

const VerseBox = styled.div`
	/* 사이즈 */
	width: 350px;
	height: 85px;
	position: relative;
	background-color: #718aff;
	color: #fff;
	font-size: 18px;
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`;

const Verse = styled.p``;

const VerseDecoration = styled.div`
	position: absolute;
	right: -40px;
	bottom: 10px;
	width: 0;
	height: 0;
	border-bottom: 10px solid transparent;
	border-top: 15px solid transparent;
	border-left: 20px solid #718aff;
	border-right: 20px solid transparent;
`;

type CharacterProps = {
	src : string;
}

const Character = styled.img<CharacterProps>`
	position: absolute;
	bottom: 10px;
	right: 20px;
`