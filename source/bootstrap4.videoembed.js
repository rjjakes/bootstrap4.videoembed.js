(function (window, document) {

    // Add function to document so it can be called with: document.videoEmbed()
    document.constructor.prototype.videoEmbed = function (selector) {
        const dqs = document.querySelectorAll.bind(document)

        // Separate scope for each iteration.
        dqs(selector).forEach(function (item, index) {

            // Get autoplay setting.
            let autoplay = 'false'
            if (item.getAttribute('data-autoplay')) {
                autoplay = item.getAttribute('data-autoplay')
            }

            // Carry on.
            let videoLink = item.getAttribute('href')
            let cleanVideoID
            let videoEmbedLink
            let previewImageUrl
            let videoTitle
            let aspect = 0.0

            if (videoLink.includes('youtube.com')) {
                cleanVideoID = videoLink.split('v=')[1].replace(/(&)+(.*)/, '')
                videoEmbedLink = `https://www.youtube.com/embed/${cleanVideoID}?autoplay=${autoplay.autoplay}`

                fetch(`https://noembed.com/embed?url=http://www.youtube.com/watch?v=${cleanVideoID}`)
                .then(response => {
                    if (response.ok) {
                        // Youtube returns a JSON response.
                        return response.json()
                    }
                })
                .then(responseJson => {
                    aspect = responseJson.height / responseJson.width

                    videoTitle = responseJson.title
                    item.innerHTML = `<img class="embedded-video-thumbnail" src="${responseJson.thumbnail_url}" alt="${videoTitle}">`
                })
                .catch(error => {
                    console.log(`Error: ${error.message}`)
                })

            }
            else if (videoLink.includes('vimeo.com')) {
                cleanVideoID = videoLink.split('/')[3].replace(/(&)+(.*)/, '')
                videoEmbedLink = `https://player.vimeo.com/video/${cleanVideoID}?autoplay=${autoplay.autoplay}`

                // For vimeo, we have to call the API to get the image URL
                fetch(`http://vimeo.com/api/v2/video/${cleanVideoID}.json`)
                .then(response => {
                    if (response.ok) {
                        // Vimeo returns a JSON response.
                        return response.json()
                    }
                })
                .then(responseJson => {
                    // Decode the response to get the preview image URL.
                    try {
                        let responseItem = responseJson.pop()

                        aspect = responseItem.height / responseItem.width

                        videoTitle = responseItem.title
                        item.innerHTML = `<img class="embedded-video-thumbnail" src="${responseItem.thumbnail_large}" alt="${videoTitle}">`
                    } catch (e) {
                        console.log(`Error: Unable to fetch thumbnail from Vimeo.`)
                    }
                })
                .catch(error => {
                    console.log(`Error: ${error.message}`)
                })

            }

            // Add bootstrap 4 modal.
            item.setAttribute('data-toggle', 'modal')
            item.setAttribute('data-target', '#videomodal')

            // Click handler.
            item.addEventListener('click', (e) => {

                let widthType = 'innerWidth',
                    width

                if (!('innerWidth' in window )) {
                    widthType = 'clientWidth'
                    window = document.documentElement || document.body
                }
                width = window[widthType]

                // Larger devices open the modal.
                if (width > 767) {
                    e.preventDefault()
                    let appendBody = `
<div class="modal fade" id="videomodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5>${videoTitle}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="VideoEmbed-Wrap VideoEmbed-animation">
            <div class="VideoEmbed-Content">
                <span class="VideoEmbed-Close"></span>
                <div style="position:relative;width:100%;height: 0;padding-bottom:${100 * aspect}%;">
                    <iframe src="${videoEmbedLink}" id="bs4-video-iframe" allowfullscreen style="width:100%;height:100%;position:absolute;border: 0;"></iframe>
                </div>    
            </div>
        </div> 
      </div>
    </div>
  </div>
</div>                    
`

                    // Add the modal template to the body.
                    let appendedItem = document.createElement('div')
                    appendedItem.setAttribute('id', 'videomodalWrap')
                    appendedItem.innerHTML = appendBody
                    document.body.appendChild(appendedItem)

                    // When closed, remove the modal from the DOM.
                    $('#videomodal').on('hidden.bs.modal', () => {
                        appendedItem.parentNode.removeChild(appendedItem)
                    })

                } else {
                    // Mobile and small tablet just open the video.
                    window.location.href = videoLink
                }
            })
        })
    }

}(window, document))

