import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const Tabs = ({ categories, currentCategory, changeCategory }) => (
  <>
    <ul className="nav nav-polls nav-justified">
      {categories.map(c => {
        let btnClassName;

        c.name === currentCategory ? (btnClassName = 'btn-primary') : (btnClassName = 'btn-outline-primary');
        return (
          <li className="nav-item active p-1" key={c.id}>
            <button className={`btn ${btnClassName} btn-block`}
              onMouseEnter={() => changeCategory(c.name)}
            >
              {c.name}
            </button>
          </li>
        )
      })}
    </ul>
  </>
);

const Articles = articles => (
  <div className='list-group'>
    {articles.map(a => (
      <div
        className="list-group-item list-group-item-action"
        key={a.id}
      >
        <small>article #{a.id}</small>
        <div className="mb-1">{a.title}</div>
      </div>
    ))
    }
  </div>
);

const Button = ({loadMoreArticles}) => (
  <div className="mt-3">
    <button className="btn btn-outline-dark btn-sm mr-2"
      onClick={()=> loadMoreArticles('prev')}>
      <i className="fas fa-angle-left"/>
    </button>
    <button className="btn btn-outline-dark btn-sm"
      onClick={()=> loadMoreArticles('next')}>
      <i className="fas fa-angle-right"/>
    </button>
  </div>
)
const App = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const categories = [
    {
      id: 1,
      name: '정치'
    },
    {
      id: 2,
      name: '경제'
    },
    {
      id: 3,
      name: '사회'
    }
  ];
  const [currentCategory, setCurrentCategory] = useState('정치')
  const [currentArticles, setCurrentArticles] = useState([])
  
  const articlePerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const req = await axios.get('https://koreanjson.com/posts');
      const allArticles = req.data;
      setArticles(allArticles);
      setCurrentArticles(allArticles.filter(a => a.UserId === 1).slice(0, articlePerPage))
    };
    fetchData();
  });

  const loadMoreArticles = direction => {
    const currentCategoryId = categories.find(
      category => category.name === currentCategoryId
    ).id;
    const currentCategoryArticles = articles.filter(
      a => a.UserId === currentCategoryId
    );

    const pagedArticles = page => {
      const lastIndex = page * articlePerPage;
      const firstIndex = lastIndex - articlePerPage;
      return currentCategoryArticles.slice(firstIndex, lastIndex)
    };

    const getLastPage = () => Math.floor(currentCategoryArticles.length / articlePerPage);

    switch (direction) {
      case 'prev':
        if (page === 1){
          setPage(getLastPage());
          setCurrentArticles(pagedArticles(getLastPage()));
        }else{
          setCurrentArticles(pagedArticles(page-1));
          setPage(page - 1 );
        }
        break;
      case 'next':
        if (page === getLastPage()){
          setPage(1);
          setCurrentArticles(pagedArticles(1));
        }else{
          setCurrentArticles(pagedArticles(page+1));
          setPage(page + 1 );
        }
        break;    
      default:
        break;
    }
  }

  const changeCurrentCategory = userSelectedCategory => {
    const category = categories.find(c => c.name === userSelectedCategory);
    setCurrentCategory(category);
    setCurrentArticles(articles.filter(post => post.UserId === category.id).slice(0, articlePerPage))
    setPage(1);
  }

  return (
    <div className="App">
      <Tabs
        categories={categories}
        currentCategory={currentCategory}
        changeCurrentCategory={changeCurrentCategory}
      />
      <Articles articles={currentArticles}/>
      <Button loadMoreArticles={loadMoreArticles}/>
    </div>
  );
}

export default App;
