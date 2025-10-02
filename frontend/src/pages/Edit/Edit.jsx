import { useEffect, useState } from "react";
import { TopNavigation, Footer, DynamicForm } from '@components';
import { useSearchParams, useNavigate } from "react-router-dom";
import { adminMetadataAPI, roomsAPI, room_typesAPI, servicesAPI, bookingsAPI, booking_serviceAPI, userAPI, articlesAPI, articleImagesAPI } from '../../api';

function Edit() {
    const [searchParams] = useSearchParams();
    const [predefined, setPredefined] = useState({});
    const [error, setError] = useState();
    const navigate = useNavigate();

   const match_API = {
        'Rooms': roomsAPI,
        'Booking': bookingsAPI,
        'Room_types': room_typesAPI,
        'Service': servicesAPI,
        'User': userAPI,
        'Booking_service': booking_serviceAPI,
        'Article': articlesAPI,
        'ArticleImage': articleImagesAPI,  
      }

   const table = searchParams.get('table') || null;
   const id = searchParams.get('id') || null;
   const fetchAPI = match_API[table];


   const callBack = () => {
    setTimeout(() => {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }, 1000); 
  };



   useEffect(() => {
      document.title = "Edit";
   }, [])

   useEffect(() => {
           const fetchPredefined = async () => {
           try {
               const response = await fetchAPI.retrieve(id);
               console.log(response.data)
               setPredefined(response.data);

           } catch (err) {
               setError(err);
           }
           };
   
           fetchPredefined();
       }, []);



  return (
     <>
         <TopNavigation />
         {table && <DynamicForm modelName={table} API={adminMetadataAPI} API_to_update={fetchAPI} predefined={predefined} callBack={callBack}/>}

         <Footer />
     
     </>
  )
}

export default Edit