import express from 'express';
import Youtube from '../controllers/youtube.controller';

 const router: express.Router = express();
 const youtube =new Youtube();  
 router.get('/video-details/:videoId', youtube.getVideoDetails);
 router.get('/video-comments/:videoId', youtube.getVideoComments);
 router.get('/', (req, res) => {
    res.render('index', { title: 'YouTube Video Info', message: 'Enter a YouTube video ID to get details.' });
  });


export default router;
