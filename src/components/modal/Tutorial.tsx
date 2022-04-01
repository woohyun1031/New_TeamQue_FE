import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { changeModal } from '../../store/modules/modal';

const Tutorial: React.FC = () => {
	const [currentNum, setCurrentNum] = useState(0);
	const dispatch = useDispatch();
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
	const prevSlide = () => {
		if (currentNum === 0) {
			setCurrentNum(TotalNum);
		} else {
			setCurrentNum(currentNum - 1);
		}
	};

	const toNotSignIn = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(changeModal('notSignIn'));
	};

	const onClick = (pageNum: number) => {
		setCurrentNum(pageNum);
	};

	return (
		<>
			<Back onClick={toNotSignIn} />
			<Container>
				<Button
					src='/images/arrow_gray_left.png'
					id='buttonPrev'
					onClick={() => prevSlide()}
				/>
				<InnerContainer>
					<Pagination>
						<Pages>
							<Page id='0' currentNum={currentNum} onClick={() => onClick(0)} />
							<Page id='1' currentNum={currentNum} onClick={() => onClick(1)} />
							<Page id='2' currentNum={currentNum} onClick={() => onClick(2)} />
							<Page id='3' currentNum={currentNum} onClick={() => onClick(3)} />
						</Pages>
					</Pagination>
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
	background-color: ${({ theme }) => theme.colors.subBackground};
`;

const Back = styled.button`
	border: none;
	background: none;
	width: 11px;
	height: 19px;
	background-image: url('/images/arrowleftblack.png');
	background-repeat: no-repeat;
	position: absolute;
	top: 70px;
	left: 50px;
	cursor: pointer;
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

const Pagination = styled.div`
	margin-bottom: 10px;
`;

const Pages = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Page = styled.li<{ id: string; currentNum: number }>`
	width: 14px;
	height: 14px;
	margin: 0px 6px;
	border-radius: 100%;
	background-color: ${({ id, currentNum }) =>
		id === currentNum.toString() ? '#718AFF' : 'white'};
	border: 1px solid ${({ theme }) => theme.colors.main};
	cursor: pointer;
`;
