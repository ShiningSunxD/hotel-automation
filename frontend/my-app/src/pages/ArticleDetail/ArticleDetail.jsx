import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articlesAPI, URL } from '../../api';
import { TopNavigation, Footer } from '@components';
import { Typography } from '@mui/material';
import styles from './ArticleDetail.module.css';



function ArticleDetail() {
    const [article, setArticle] = useState({});
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const slug = useParams().slug;

    useEffect(() => {
        setLoading(true);
        const fetchArticle = async () => {
        try {
            const response = await articlesAPI.retrieve(slug);
            console.log(response.data);
            setArticle(response.data);
            setImages(response.data.images);
            console.log(response.data.images);
        } catch (error) {
            console.error('Ошибка при загрузке статей:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchArticle();
    }, []);


  return (
    <>
        <TopNavigation />

        <Typography variant="h2"> {article.title} </Typography>
        
        {images && images.length > 0 && 
            <img className={styles.FirstImage}
                src={URL + images[0].image_url}
                alt={`Ошибка загрузки фото`}
            />
        }
        <Typography variant="body1" align='justify' gutterBottom>
            {article.content}
        </Typography>

        <div className={styles.imagesContainer}>
            {images && images.length > 0 &&
                images.slice(1).map((item) => {
                    return (
                        <img className={styles.OtherImages}
                            src={URL + item.image_url}
                            alt={`Ошибка загрузки фото`}
                        />
                    )
                })
            }
        </div>

        <Footer />
    </>
  );
};

export default ArticleDetail;