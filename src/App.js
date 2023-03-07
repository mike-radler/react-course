import React, { useEffect, useState } from 'react';
import PostService from './API/PostService';
import { useFetching } from './components/hooks/useFetching';

import { usePosts } from './components/hooks/usePosts';
import PostFilter from './components/PostFilter';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import MyButton from './components/UI/Button/MyButton';
import Loader from './components/UI/Loader/Loader';
import MyModal from './components/UI/MyModal/MyModal';
import './styles/App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ sort: '', query: '' })
  const [modal, setModal] = useState(false);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const posts = await PostService.getAll();
    setPosts(posts)
  })

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  return (
    <div className="App">
      <MyButton style={{ marginTop: 15 }} onClick={() => setModal(true)}>
        Создать пост
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>

      <hr style={{ margin: '5px 0' }} />

      <PostFilter
        filter={filter}
        setFilter={setFilter}
      />
      {postError &&
        <h1>Произошла ошибка! ${postError}</h1>
      }
      {isPostsLoading
        ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}><Loader /></div>
        : <PostList remove={removePost} posts={sortedAndSearchedPosts} title='Список постов' />
      }
    </div>
  );
}

export default App;
