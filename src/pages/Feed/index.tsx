import React, {useState, useEffect} from 'react';
import { View, Text, FlatList } from 'react-native';

import api from '../../services/api';

import { Container, Post, Header, Avatar, Name, PostImage, Description } from './styles';

interface PostItem {
  id: string;
  description: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  }
}

const Feed: React.FC = () => {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    console.log('use effct ok');
    async function loadFeed () {
      console.log('aqui foi');
      const response = await fetch(
        `http://localhost:3333/feed?_expand=author&_limit=4&_page=1`
      );
      const data = await response.json();
      console.log(data);
      setFeed(data)
    }
    loadFeed();
  }, [])
  return (
    <Container>
      <FlatList 
        data={feed}
        keyExtractor={(post: PostItem ) => String(post.id)}
        renderItem ={ ({item}) => (
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name} </Name>
            </Header>
            <PostImage source={{ uri: item.image }} />
            <Description>
              <Name>{item.author.name} </Name> {item.description}
            </Description>
          </Post>
        )}
      />
    </Container>
  );
}

export default Feed;