import { useEffect, useState } from 'react';
import styled from 'styled-components';
import apis from '../../api';
import Card from './Card';

interface Props {
	tabState: boolean;
}

const CardList: React.FC<Props> = ({ tabState }) => {
	const [learnCards, setLearnCards] = useState() as any;
	const [teachCards, setTeachCards] = useState() as any;
	const isToken = sessionStorage.getItem('accessToken') ? true : false;
	const fetch1 = async () => {
		const response = await apis.loadLearnClass();
		setLearnCards(response.data);
	};
	const fetch2 = async () => {
		const response = await apis.loadTeachClass();
		setTeachCards(response.data);
	};

	useEffect(() => {
		if (isToken) {
			fetch1();
			fetch2();
		}
	}, []);

	return (
		<Container>
			{tabState
				? learnCards &&
				  learnCards.map((card: any, index: number) => (
						<Card key={index} state={card.state} {...card.class} />
				  ))
				: teachCards &&
				  teachCards.map((card: any, index: number) => (
						<Card key={index} {...card} />
				  ))}
		</Container>
	);
};

export default CardList;

const Container = styled.div`
	width: 850px;
	height: 400px;
	overflow-x: scroll;
	white-space: nowrap;
	&::-webkit-scrollbar {
		height: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #ccc;
		border-radius: 10px;
	}
`;