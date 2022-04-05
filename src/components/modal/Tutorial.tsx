import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { changeModal } from '../../store/modules/modal';

const Tutorial = () => {
	const [page, setPage] = useState(0);
	const dispatch = useDispatch();

	const pageItems: { id: string; type: string; imageUrl: string }[] = [
		{ id: '0', type: 'normal', imageUrl: '/images/tutorial1.png' },
		{ id: '1', type: 'reverse', imageUrl: '/images/tutorial2.png' },
		{ id: '2', type: 'reverse', imageUrl: '/images/tutorial3.png' },
		{ id: '3', type: 'reverse', imageUrl: '/images/tutorial4.png' },
		{ id: '4', type: 'normal', imageUrl: '/images/tutorial5.png' },
	];
	const totalNum = pageItems.length;
	const imageWidth = 1004;

	const nextSlide = () => {
		setPage((page + 1) % totalNum);
	};

	const prevSlide = () => {
		setPage((page - 1 + totalNum) % totalNum);
	};

	const toNotSignIn = () => {
		dispatch(changeModal('notSignIn'));
	};

	return (
		<>
			<CloseButton
				currentNum={page}
				onClick={toNotSignIn}
				src={
					pageItems[page].type === 'normal'
						? '/images/closeblue.png'
						: '/images/closewhite.png'
				}
			/>
			<Container imageWidth={imageWidth}>
				<Button
					src={
						pageItems[page].type === 'normal'
							? '/images/arrowleftblue.png'
							: '/images/arrowleftwhite.png'
					}
					id='buttonPrev'
					onClick={prevSlide}
				/>
				<Button
					src={
						pageItems[page].type === 'normal'
							? '/images/arrowblueright.png'
							: '/images/arrowwhiteright.png'
					}
					id='buttonNext'
					onClick={nextSlide}
				/>
				<Pagination>
					<Pages>
						{pageItems.map((result) => (
							<Page
								key={result.id}
								id={result.id}
								type={result.type}
								page={page}
								onClick={() => {
									setPage(parseInt(result.id));
								}}
							/>
						))}
					</Pages>
				</Pagination>
				<InnerContainer>
					<Wrap>
						<BoxList page={page}>
							{pageItems.map((Items, index) => (
								<React.Fragment key={index}>
									<Box src={Items.imageUrl} imageWidth={imageWidth} />
								</React.Fragment>
							))}
						</BoxList>
					</Wrap>
				</InnerContainer>
			</Container>
		</>
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

const BoxList = styled.div<{ page: number }>`
	width: 5020px;
	height: 100%;
	transition: 0.3s;
	transform: translateX(${({ page }) => page * -1004}px);
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
	background-image: url(${({ src }) => src});
	background-size: contain;
	position: absolute;
	top: 30px;
	right: 30px;
	z-index: 1002;
`;

const Button = styled.button<{ src: string; id: string }>`
	background-image: url(${({ src }) => src});
	background-repeat: no-repeat;
	background-position: center center;
	background-size: contain;
	width: 50px;
	height: 50px;
	position: absolute;
	z-index: 1002;
	top: 43%;
	left: ${({ id }) => id === 'buttonPrev' && '10px'};
	right: ${({ id }) => id === 'buttonNext' && '10px'};
`;

const Pagination = styled.div`
	margin-bottom: 20px;
	position: absolute;
	z-index: 1002;
	top: 40px;
	left: 45%;
`;

const Pages = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Page = styled.li<{ id: string; page: number; type: string }>`
	width: 8px;
	height: 8px;
	margin: 0px 6px;
	border-radius: 100%;
	background-color: ${({ id, page, type }) =>
		type === 'reverse'
			? parseInt(id) === page
				? 'white'
				: '#BCC8FF'
			: parseInt(id) === page
			? '#718AFF'
			: '#BCC8FF'};
	cursor: pointer;
`;
