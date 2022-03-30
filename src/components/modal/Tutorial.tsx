import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ModalCloseButton from './ModalCloseButton';

const Tutorial: React.FC = () => {
	const [currentNum, setCurrentNum] = useState(0);
	const TotalNum = 3;
	const slideRef = useRef<any>(null);

	useEffect(() => {
		if (slideRef) {
			slideRef.current.style.transition = 'all 0.8s ease-in-out';
			slideRef.current.style.transform = `translateX(${currentNum * -860}px)`;
		}
		console.log(currentNum);
	}, [currentNum]);

	const nextSlide = () => {
		if (currentNum >= TotalNum) {
			setCurrentNum(0);
		} else {
			setCurrentNum(currentNum + 1);
		}
	};
	// Prev 버튼 클릭 시
	const prevSlide = () => {
		if (currentNum === 0) {
			setCurrentNum(TotalNum);
		} else {
			setCurrentNum(currentNum - 1);
		}
	};

	return (
		<>
			<ModalCloseButton />
			<Container>
				<Button
					src='/images/arrow_gray_left.png'
					id='buttonPrev'
					onClick={() => prevSlide()}
				/>
				<InnerContainer>
					<Wrap>
						<BoxList ref={slideRef}>
							<Box color='blue'>page1</Box>
							<Box color='red'>page2</Box>
							<Box color='pink'>page3</Box>
							<Box color='green'>page4</Box>
						</BoxList>
					</Wrap>
				</InnerContainer>
				<Button
					src='/images/arrow_gray_right.png'
					id='buttonPrev'
					onClick={() => nextSlide()}
				/>
			</Container>
		</>
	);
};

export default Tutorial;

const Container = styled.div`
	display: flex;
	align-items: center;
`;

const InnerContainer = styled.div`
	position: relative;
	width: 1000px;
	height: 730px;
	padding: 50px 70px;

	background-color: ${({ theme }) => theme.colors.background};

	&::-webkit-scrollbar {
		display: none;
	}
`;
const Wrap = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
`;

const BoxList = styled.div`
	width: 3440px;
	height: 100%;
`;

const Box = styled.div`
	float: left;
	width: 860px;
	height: 100%;
	font-size: 50px;
	background-color: ${({ color }) => color};
	text-align: center;
`;

const Button = styled.button<{ src: string }>`
	border: none;
	background: none;
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	width: 100px;
	height: 100px;
	cursor: pointer;
`;
