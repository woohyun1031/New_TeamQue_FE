import { AnyLengthString } from 'aws-sdk/clients/comprehendmedical';
import { Console } from 'console';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import api from '../../api';
import { RootState } from '../../store/configStore';
import { CardType } from '../../type';
import Card from './Card';

type CardListProps = {
	tabState: boolean;
};

const CardList = ({ tabState }: CardListProps) => {
	const isLogin = useSelector((state: RootState) => state.user.isLogin);

	const slider: React.RefObject<HTMLDivElement> | null = useRef(null);
	const [isDown, setIsDown] = useState<boolean>(false);
	const [startX, setStartX] = useState<number | undefined>();
	const [scrollLeft, setScrollLeft] = useState<number | undefined>();

	const { data: learnCards } = useQuery('learnCard', api.loadLearnCards, {
		enabled: isLogin,
	});
	const { data: teachCards } = useQuery('teachCard', api.loadTeachCards, {
		enabled: isLogin,
	});

	const onMouseDown = (e: MouseEvent | undefined) => {
		setIsDown(true);
		setStartX(
			e
				? slider.current
					? e.pageX - slider.current.offsetLeft
					: undefined
				: undefined
		);
		const leftside =
			slider.current?.scrollLeft === 0 ? 0.1 : slider.current?.scrollLeft;
		setScrollLeft(leftside);
	};
	const onMouseUp = () => {
		setIsDown(false);
	};
	const onMouseMove = (e: MouseEvent | undefined) => {
		if (!isDown) return;
		e && e.preventDefault();
		console.log(scrollLeft, 'scrollLeft');
		const x = e
			? slider.current
				? e.pageX - slider.current.offsetLeft
				: undefined
			: undefined;
		const walk = x && startX && x - startX;
		if (!slider.current || !scrollLeft || !walk) return null;
		console.log('slider.current.scrollLeft', slider.current.scrollLeft);
		slider.current.scrollLeft = scrollLeft - walk;
	};

	useEffect(() => {
		console.log('set');
	}, [scrollLeft]);

	return (
		<Container
			ref={slider}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseMove={onMouseMove}
		>
			{tabState
				? learnCards &&
				  learnCards.map((card: CardType) => <Card key={card.id} {...card} />)
				: teachCards &&
				  teachCards.map((card: CardType) => <Card key={card.id} {...card} />)}
		</Container>
	);
};

export default CardList;

const Container = styled.div`
	width: 850px;
	height: 400px;
	overflow-x: scroll;
	white-space: nowrap;
	display: flex;
	padding-right: 10px;
	&::-webkit-scrollbar {
		height: 5px;
	}
	&::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background-color: ${({ theme }) => theme.colors.scroll};
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: ${({ theme }) => theme.colors.scrollHover};
	}
`;
