import { TopNavigation, Footer, ArticleList } from '@components';
import { useEffect } from 'react';

function News() {

   useEffect(() => {
      document.title = "News";
   })

   
        


  return (
     <>
         <TopNavigation />



         <ArticleList fromNews={true}/>
         
         <Footer />
     
     </>
  )
}

export default News