import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import RepoPicker from '../components/RepoPicker'

//styled components
const StyledContainer = styled.div`
  padding-top: 50px;
  padding-right: 100px;
  padding-bottom: 100px;
  padding-left: 100px;
`;
const StyledHeader = styled.div`
    font-size: 60px; 
    font-weight: bold;
    padding-bottom: 10px;   
`;

function Home() {
    const [data, setData] = useState([]);
    //grab github data - user agent header wasn't needed
    useEffect(() => {   
        const fetchData = async () => {
        try {
            //if this wasn't a public api, it would be encrypted 
            const result = await axios('https://api.github.com/search/repositories?sort=stars&q=javascript&per_page=30&page=1');
            setData(result.data);
        } catch (error) { 
    }
};
    fetchData();
    }, []);
        return (
        <div> 
            <StyledContainer>  
                <StyledHeader>Hello Flexera</StyledHeader>
                {/* hand data prop down to child component */}
                <RepoPicker data={data} />
            </StyledContainer>
        </div>  
    )
}

export default Home;