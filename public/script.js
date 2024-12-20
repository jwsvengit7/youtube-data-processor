document.getElementById('video-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const videoId = document.getElementById('videoId').value.trim();
  
    if (!videoId) return;
  
    try {
        document.getElementById('preloader').style.display = 'block';
      const videoData = await fetch(`/api/youtube/video-details/${videoId}`).then(res => res.json());
      const commentsData = await fetch(`/api/youtube/video-comments/${videoId}`).then(res => res.json());
      document.getElementById('video-title').innerHTML = `<h3>${videoData.title}</h3>`;
      document.getElementById('like-count').textContent = videoData.likeCount;
      document.getElementById('comment-count').textContent = commentsData.length;
      document.getElementById('preloader').style.display = 'none';
      const videoPlayer = document.getElementById('video-player');
      videoPlayer.innerHTML = `<iframe width="360" height="215" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>;`
      const commentsPagination = document.getElementById('comments-pagination');
      showCommentsPagination(commentsData);
    } catch (error) {
      console.error('Error fetching video data', error);
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
  
    const remainingComments = commentsData.length - endIndex;
    const showMoreBtn = document.getElementById('show-more-btn');
    if (remainingComments > 0) {
      showMoreBtn.style.display = 'block';
    } else {
      showMoreBtn.style.display = 'none'; 
    }
  }
  