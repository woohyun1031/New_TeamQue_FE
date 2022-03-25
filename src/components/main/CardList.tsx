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
		console.log(response.data);
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

  useEffect(()=> {

    console.log(learnCards, teachCards)
  },[learnCards, teachCards])


	return (
		<Container>
			{tabState
				? learnCards &&
					learnCards.map((card: any) => <Card key={card.id} state={card.state} {...card.class} />)
				: teachCards &&
					teachCards.map((card: any) => <Card key={card.id} {...card} />)}
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


[
 {
    id: '1',
    createdAt: '2022-03-17T09:29:42.678Z',
    updatedAt: '2022-03-17T09:29:42.678Z',
    state: '',
    userId: '11',
    username: '',
    classId: '1',
    class :{
      id: '1',
      title: '야너두',
      time: '매일 8시',
      teacher: '안녕하세',
      imageUrl: null,
      userId: '11',
      createdAt: '2022-03-17T09:14:42.213Z',
      updatedAt: '2022-03-17T09:14:42.213Z'
    }
  },
   {
    id: 2,
    createdAt: '2022-03-19T12:07:31.125Z',
    updatedAt: '2022-03-19T12:07:31.125Z',
    state: '',
    userId: 11,
    username: '안녕하세',
    classId: 2,
    class: {
      id: 2,
      title: 'url 없는 테스트',
      time: '매일 6시',
      teacher: '안녕하세',
      imageUrl: null,
      userId: 11,
      createdAt: '2022-03-19T03:44:57.181Z',
      updatedAt: '2022-03-19T03:44:57.181Z'
    }
  }
]