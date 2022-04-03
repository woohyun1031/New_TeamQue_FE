import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import api from '../../api';
import { RootState } from '../../store/configStore';
import Card from './Card';

type CardType = {
	id: number;
	title: string;
	teacher: string;
	imageUrl: string;
	timeTable: string[];
	state: 'wait' | 'accepted' | 'teach';
};

interface CardListProps {
	tabState: boolean;
}

const CardList = ({ tabState } : CardListProps) => {
	const [learnCards, setLearnCards] = useState<CardType[]>();
	const [teachCards, setTeachCards] = useState<CardType[]>();

	const isLogin = useSelector((state: RootState) => state.user.isLogin);

	const loadLearnClass = async () => {
		const data = await api.loadLearnClass();
		setLearnCards(data);
	};

	const loadTeachClass = async () => {
		const data = await api.loadTeachClass();
		setTeachCards(data);
	};

	useEffect(() => {
		if (isLogin) {
			loadLearnClass();
			loadTeachClass();
		}
	}, [isLogin]);

	return (
		<Container>
			{tabState
				? learnCards &&
				  learnCards.map((card: CardType) => (
						<Card key={card.id} {...card} loadLearnClass={loadLearnClass} />
				  ))
				: teachCards &&
				  teachCards.map((card: CardType) => <Card key={card.id} {...card} loadLearnClass={loadLearnClass}/>)}
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
