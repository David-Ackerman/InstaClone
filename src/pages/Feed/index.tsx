import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, FlatList } from 'react-native';

import LazyImage from '../../components/LazyImage';

import { Container, Post, Header, Avatar, Name, Description, Loading } from './styles';

interface PostItem {
  id: string;
  description: string;
  image: string;
  small: string;
  aspectRatio: number;
  author: {
    name: string;
    avatar: string;
  }
}

const Feed: React.FC = () => {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  async function loadPage(pageNumber = page, shoouldRefresh = false) {
    if (total && pageNumber > total) return; 

    setLoading(true);
    const response = await fetch(`http://10.0.2.2:3000/feed?_expand=author&_limit=4&_page=${pageNumber}`);
    const data = await response.json();
    const totalItems = Number(response.headers.get('X-Total-Count'))

    setTotal(Math.ceil(totalItems / 5));
    setFeed(shoouldRefresh ? data : [...feed, ...data]);
    setPage(pageNumber + 1);
    setLoading(false);
  }

  useEffect(() => {
    loadPage();
  }, [])

  async function refreshList( ){
    setRefreshing(true);

    await loadPage(1, true);

    setRefreshing(false);
  }

  const handleViewableChanged = useCallback(({ changed }) => {
    setViewable(changed.map(({ item }) => item.id));
  }, []);

  return (
    <Container>
      <FlatList 
        data={feed}
        keyExtractor={(post: PostItem ) => String(post.id)}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.1}
        onRefresh={refreshList}
        refreshing={refreshing}
        onViewableItemsChanged={handleViewableChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }}
        ListFooterComponent={loading ? <Loading /> : <View/>}
        renderItem ={ ({item}) => (
          <Post>
            <Header>
              <Avatar source={{ uri: item.author.avatar }} />
              <Name>{item.author.name} </Name>
            </Header>
            <LazyImage
              shouldLoad={viewable.includes(item.id)}
              aspectRatio={item.aspectRatio}
              smallSource={{ uri: item.small}}
              source={{ uri: item.image }}
            />
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