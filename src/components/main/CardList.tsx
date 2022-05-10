import { AnyLengthString } from 'aws-sdk/clients/comprehendmedical';
import { MouseEvent, useRef, useState } from 'react';
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
		setScrollLeft(slider.current?.scrollLeft);
	};
	const onMouseUp = (e: MouseEvent | undefined) => {
		setIsDown(false);
		if (!isDown) return;
		e && e.preventDefault();
		const x = e
			? slider.current
				? e.pageX - slider.current.offsetLeft
				: undefined
			: undefined;
		console.log('mouse x val', x);
		const walk = x && startX && x - startX;
		console.log('mouse walk val', walk);
		if (!slider.current?.scrollLeft) return null;
		if (!scrollLeft) return null;
		if (!walk) return null;
		console.log('slider.current.scrollLeft', slider.current.scrollLeft);
		slider.current.scrollLeft = scrollLeft - walk;
		//slider.current.scrollLeft = 200;
	};
	// const onMouseMove = (e: any) => {
	// 	console.log('mouseMove');
	// 	if (!isDown) return;
	// 	e.preventDefault();
	// 	const x = e.pageX - slider.offsetLeft;
	// 	const walk = startX && x - startX;
	// 	slider.scrollLeft = scrollLeft! - walk!;
	// };

	return (
		<Container ref={slider} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
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
