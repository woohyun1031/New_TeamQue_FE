import styled from 'styled-components';
import apis from '../../api';
import Card from './Card';

const CardList = () => {
	const fetchData = async() => {
		const response = await apis.loadClass()
		console.log(response.data)
	}
	// fetchData()
	return (
		<Container>
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
		</Container>
	);
};

export default CardList;

const Container = styled.div`
	/* 사이즈 */
	width: 850px;
	height: 400px;
	overflow-x: scroll;
	white-space: nowrap;
	&::-webkit-scrollbar {
		height: 5px; /*스크롤바의 너비*/
	}

	&::-webkit-scrollbar-thumb {
		background-color: #ccc; /*스크롤바의 색상*/
		border-radius: 10px;
	}

	&::-webkit-scrollbar-track {
		/*   background-color: yellow; /*스크롤바 트랙 색상*/
	}
`;
