import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesAPI } from '../../api';
import { Paper, Typography } from '@mui/material';
import styles  from './ArticleList.module.css'

// the component shows a list of article titles 

function ArticleList({fromNews=false}) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchArticleTitles = async () => {
        try {
            const response = await articlesAPI.list();
            console.log(response.data);
            setArticles(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке статей:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchArticleTitles();
    }, []);


  return (
    <div className={styles.articlesContainer}>

        {fromNews && articles.toReversed().map((item) => {
            return (
            <Paper className={styles.articleContainer} onClick={() => navigate(`/articles/${item.slug}`)} key={item.id} variant="elevation" elevation={3}> 
                {item.title} 
            </Paper>
            )
        })}

        {!fromNews && articles.toReversed().slice(0,3).map((item) => {

            return (
            <Paper className={styles.articleContainer} onClick={() => navigate(`/articles/${item.slug}`)} key={item.id} variant="elevation" elevation={3}> 
                {item.title} 
            </Paper>
            )
        })}
    </div>
  );
};

export default ArticleList;