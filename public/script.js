document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('video-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const videoId = document.getElementById('videoId').value.trim();

    if (!videoId) return;

    try {
      document.getElementById('preloader').style.display = 'block';

      const videoResponse = await fetch(`/api/youtube/video-details/${videoId}`);
      if (!videoResponse.ok) {
        throw new Error(`Error fetching video data: ${videoResponse.statusText}`);
      }
      const videoData = await videoResponse.json();

      const commentsResponse = await fetch(`/api/youtube/video-comments/${videoId}`);
      if (!commentsResponse.ok) {
        throw new Error(`Error fetching comments data: ${commentsResponse.statusText}`);
      }
      const commentsData = await commentsResponse.json();
      console.log(videoResponse.body)
      console.log(commentsResponse.body)

      console.log("********commentsResponse******")

      // Clear previous content before displaying new data
      document.getElementById('video-title').innerHTML = '';
     

      // Set the new video title
      const videoTitleElement = document.getElementById('video-title');
      if (videoTitleElement) {
        videoTitleElement.innerHTML = `<h3>${videoData.title}</h3>`;
      } else {
        console.error('Video title element not found');
      }

      // Set like and comment counts
      const likeCountElement = document.getElementById('like-count');
      if (likeCountElement) {
        likeCountElement.innerHTML = videoData.likeCount;
      } else {
        console.error('Like count element not found');
      }

      const commentCountElement = document.getElementById('comment-count');
      if (commentCountElement) {
        commentCountElement.innerHTML = commentsData.length;
      } else {
        console.error('Comment count element not found');
      }

      // Set the video iframe
      const videoPlayer = document.getElementById('video-player');
      if (videoPlayer) {
        videoPlayer.innerHTML = `<iframe width="360" height="215" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      } else {
        console.error('Video player element not found');
      }

      // Handle comments pagination
      const commentsPagination = document.getElementById('comments-pagination');
      if (commentsPagination) {
        console.log("**************")
        showCommentsPagination(commentsData);
      } else {
        console.error('Comments pagination element not found');
      }

      // Hide preloader after everything is loaded
      document.getElementById('preloader').style.display = 'none';

    } catch (error) {
      // Hide preloader and show error message
      document.getElementById('preloader').style.display = 'none';
      console.error('Error:', error.message);
      alert('There was an error loading the video or comments. Please try again later.');
    }
  });

  function showCommentsPagination(commentsData) {
    const commentsPagination = document.getElementById('comments-pagination');
    commentsPagination.innerHTML = '';  

    const showMoreBtn = document.createElement('button');
    showMoreBtn.id = 'show-more-btn';
    showMoreBtn.textContent = 'Show More';
    commentsPagination.appendChild(showMoreBtn);

    displayCommentsForPage(1, commentsData);

    showMoreBtn.addEventListener('click', function() {
      const currentPage = parseInt(showMoreBtn.getAttribute('data-page') || 1);
      displayCommentsForPage(currentPage + 1, commentsData);
      showMoreBtn.setAttribute('data-page', currentPage + 1);
    });
  }

  function displayCommentsForPage(pageNumber, commentsData) {
    const commentsPerPage = 10;  
    const startIndex = (pageNumber - 1) * commentsPerPage;
    const endIndex = pageNumber * commentsPerPage;
    const commentsToDisplay = commentsData.slice(startIndex, endIndex);

    const videoDetails = document.getElementById('video-details');
    if (videoDetails) {
      let commentsHTML = '<h4>Comments:</h4>';
      commentsToDisplay.forEach(comment => {
        commentsHTML += `
          <div class="comment">
            <p><strong>${comment.author}</strong>: ${comment.comment}</p>
            <p>Likes: ${comment.likeCount}</p>
          </div>
        `;
      });
      videoDetails.innerHTML = commentsHTML;
    }

    const remainingComments = commentsData.length - endIndex;
    const showMoreBtn = document.getElementById('show-more-btn');
    if (remainingComments > 0) {
      showMoreBtn.style.display = 'block';
    } else {
    }
  }
});
