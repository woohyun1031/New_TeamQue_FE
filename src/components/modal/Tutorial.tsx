import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { changeModal } from '../../store/modules/modal';

const Tutorial: React.FC = () => {
	const [currentNum, setCurrentNum] = useState(0);
	const dispatch = useDispatch();
	const slideRef = useRef<any>(null);

	const pageItems: { id: string; type: string; imageUrl: string }[] = [
		{ id: '0', type: 'normal', imageUrl: '/images/tutorial1.png' },
		{ id: '1', type: 'convert', imageUrl: '/images/tutorial2.png' },
		{ id: '2', type: 'convert', imageUrl: '/images/tutorial3.png' },
		{ id: '3', type: 'convert', imageUrl: '/images/tutorial4.png' },
		{ id: '4', type: 'normal', imageUrl: '/images/tutorial5.png' },
	];
	const totalNum = pageItems.length - 1;
	const imageWidth = 1004;

	useEffect(() => {
		if (slideRef) {
			slideRef.current.style.transition = 'all 0.3s ease-in-out';
			slideRef.current.style.transform = `translateX(${currentNum * -1004}px)`;
		}
		console.log(currentNum);
	}, [currentNum]);

	const nextSlide = () => {
		if (currentNum >= totalNum) {
			setCurrentNum(0);
		} else {
			setCurrentNum(currentNum + 1);
		}
	};
	const prevSlide = () => {
		if (currentNum === 0) {
			setCurrentNum(totalNum);
		} else {
			setCurrentNum(currentNum - 1);
		}
	};

	const toNotSignIn = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		dispatch(changeModal('notSignIn'));
	};

	const onClick = (pageNum: string) => {
		if (pageNum) {
			const toNum = parseInt(pageNum);
			setCurrentNum(toNum);
		}
	};

	return (
		<React.Fragment>
			<CloseButton
				currentNum={currentNum}
				onClick={toNotSignIn}
				src={
					pageItems[currentNum].type === 'normal'
						? '/images/closeblue.png'
						: '/images/closewhite.png'
				}
			/>
			<Container imageWidth={imageWidth}>
				<Button
					src={
						pageItems[currentNum].type === 'normal'
							? currentNum === 0
								? 'none'
								: '/images/arrowblueleft.png'
							: '/images/arrowwhiteleft.png'
					}
					id='buttonPrev'
					onClick={() => prevSlide()}
				/>
				<Button
					src={
						pageItems[currentNum].type === 'normal'
							? currentNum === 4
								? 'none'
								: '/images/arrowblueright.png'
							: '/images/arrowwhiteright.png'
					}
					id='buttonNext'
					onClick={() => nextSlide()}
				/>
				<Pagination>
					<Pages>
						{pageItems.map((result, index) => (
							<React.Fragment key={index}>
								<Page
									id={result.id}
									type={result.type}
									currentNum={currentNum}
									onClick={() => onClick(result.id)}
								/>
							</React.Fragment>
						))}
					</Pages>
				</Pagination>
				<InnerContainer>
					<Wrap>
						<BoxList ref={slideRef}>
							{pageItems.map((Items, index) => (
								<React.Fragment key={index}>
									<Box src={Items.imageUrl} imageWidth={imageWidth} />
								</React.Fragment>
							))}
						</BoxList>
					</Wrap>
				</InnerContainer>
			</Container>
		</React.Fragment>
	);
};

export default Tutorial;

const Container = styled.div<{ imageWidth: number }>`
	position: relative;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.subBackground};
	width: ${({ imageWidth }) => imageWidth + 'px'};
	height: 723px;
`;

const InnerContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
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
	width: 5020px;
	height: 100%;
`;

const Box = styled.div<{ src: string; imageWidth: number }>`
	border: none;
	background: none;
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	background-size: cover;
	float: left;
	width: ${({ imageWidth }) => imageWidth + 'px'};
	height: 100%;
	font-size: 50px;
	text-align: center;
`;

const CloseButton = styled.button<{
	currentNum: number;
	src: string;
}>`
	width: 17px;
	height: 17px;
	border: none;
	background: none;
	background-image: url(${({ src }) => src});
	background-size: contain;
	position: absolute;
	top: 30px;
	right: 30px;
	cursor: pointer;
	z-index: 9997;
`;

const Button = styled.button<{ src: string; id: string }>`
	border: none;
	background: none;
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	width: 50px;
	height: 50px;
	cursor: pointer;
	position: absolute;
	z-index: 9998;
	top: 43%;
	left: ${({ id }) => id === 'buttonPrev' && '10px'};
	right: ${({ id }) => id === 'buttonNext' && '10px'};
`;

const Pagination = styled.div`
	margin-bottom: 20px;
	position: absolute;
	z-index: 9999;
	top: 40px;
	left: 45%;
`;

const Pages = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Page = styled.li<{ id: string; currentNum: number; type: string }>`
	width: 8px;
	height: 8px;
	margin: 0px 6px;
	border-radius: 100%;
	background-color: ${({ id, currentNum, type }) =>
		type === 'convert'
			? id === currentNum.toString()
				? 'white'
				: '#BCC8FF'
			: id === currentNum.toString()
			? '#718AFF'
			: '#BCC8FF'};
	cursor: pointer;
`;
